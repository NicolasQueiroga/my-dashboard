from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import json
import os


@api_view(['POST'])
def launch(request, *args, **kwargs):
    with open('../tf/my_variables.json', 'w') as outfile:
        json.dump(request.data['json'], outfile)

    default_data = {"users": request.data['json']['users'], "user_groups": request.data['json']['user_groups'], "instances": [], "security_groups": []}
    with open('../tf/default_variables.json', 'w') as outfile:
        json.dump(default_data, outfile)
    try:
        os.chdir('../tf')
        os.system(f"terraform workspace select default")
        os.system(f"terraform apply -var-file=default_variables.json -auto-approve")
    except Exception as e:
        return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        os.system('rm default_variables.json')
    

    sgs = request.data['json']['security_groups']
    regions_dict = {}
    for region in os.listdir('./terraform.tfstate.d'):
        if len(os.listdir(f'./terraform.tfstate.d/{region}')) > 0:
            region = region.split('-vars')[0]
            regions_dict[region] = {"aws_region": region, "users": [], "user_groups": [], "instances": [], "security_groups": []}
    for instance in request.data['json']['instances']:
        region = instance['region']
        security_groups_ids = instance['security_groups_ids']
        if region not in list(regions_dict.keys()):
            regions_dict[region] = {"aws_region": region, "users": [], "user_groups": []}
            regions_dict[region]["instances"] = [instance]
        else:
            regions_dict[region]["instances"].append(instance)
    
        for sg in sgs:
            for id in security_groups_ids:
                if sg['id'] == id:
                    if "security_groups" not in list(regions_dict[region].keys()):
                        regions_dict[region]["security_groups"] = [sg]
                    else:
                        regions_dict[region]["security_groups"].append(sg)

    os.chdir('../api')
    for region in list(regions_dict.keys()):
        with open(f'../tf/{region}-vars.json', 'w') as outfile:
            json.dump(regions_dict[region], outfile)
        try:
            os.chdir('../tf')
            if not os.path.exists(f"./terraform.tfstate.d/{region}"):
                os.system(f"terraform workspace new {region}")
            else:
                os.system(f"terraform workspace select {region}")
            os.system(f'terraform apply -var-file={region}-vars.json -auto-approve')
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        finally:
            os.system(f"terraform workspace select default")
            os.system(f'rm {region}-vars.json')

    return Response({'status': 'success'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def variables(request, *args, **kwargs):
    with open('../tf/my_variables.json', 'r') as infile:
        data = json.load(infile)
    return Response(data, status=status.HTTP_200_OK)