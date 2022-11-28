from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import json
import os


def create_general_json(request):
    with open("my_variables.json", "w") as outfile:
        json.dump(request.data["json"], outfile)


def create_user_json(request):
    default_data = {
        "users": request.data["json"]["users"],
        "user_groups": request.data["json"]["user_groups"],
        "instances": [],
        "security_groups": [],
    }
    with open("default_variables.json", "w") as outfile:
        json.dump(default_data, outfile)


def apply_user_terraform():
    os.system(f"terraform workspace select default")
    os.system(f"terraform apply -var-file=default_variables.json -auto-approve")


def create_instance_dict(request):
    sgs = request.data["json"]["security_groups"]
    regions_dict = {}
    if not os.path.exists("./terraform.tfstate.d"):
        os.makedirs("./terraform.tfstate.d")
    for region in os.listdir("./terraform.tfstate.d"):
        if len(os.listdir(f"./terraform.tfstate.d/{region}")) > 0:
            region = region.split("-vars")[0]
            regions_dict[region] = {
                "aws_region": region,
                "users": [],
                "user_groups": [],
                "instances": [],
                "security_groups": [],
            }
    for instance in request.data["json"]["instances"]:
        region = instance["region"]
        security_groups_ids = instance["security_groups_ids"]
        if region not in list(regions_dict.keys()):
            regions_dict[region] = {
                "aws_region": region,
                "users": [],
                "user_groups": [],
                "security_groups": [],
            }
            regions_dict[region]["instances"] = [instance]
        else:
            regions_dict[region]["instances"].append(instance)
        if len(security_groups_ids) == 0:
            regions_dict[region]["security_groups"].append(
                {
                        "id": "0",
                        "name": "default-sg",
                        "description": "default-sg",
                        "ingress": [
                            {
                                "from_port": 22,
                                "to_port": 22,
                                "protocol": "tcp",
                                "cidr_blocks": ["0.0.0.0/0"],
                            },
                        ],
                        "egress": [
                            {
                                "from_port": 0,
                                "to_port": 0,
                                "protocol": "-1",
                                "cidr_blocks": ["0.0.0.0/0"],
                            },
                        ],
                    }
            )
            regions_dict[region]["instances"][-1]["security_groups_ids"] = ["0"]

        for sg in sgs:
            for id in security_groups_ids:
                if sg["id"] == id and sg not in regions_dict[region]["security_groups"]:
                    regions_dict[region]["security_groups"].append(sg)
                    

        print(regions_dict)
    return regions_dict


@api_view(["POST"])
def launch(request, *args, **kwargs):
    if os.getcwd() == "/home":
        os.chdir("tf")
    else:
        os.chdir("../tf")
    if not os.path.exists("./.terraform"):
        os.system(f"terraform init")

    create_general_json(request)
    create_user_json(request)

    try:
        apply_user_terraform()
    except Exception as e:
        os.chdir("../api")
        return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        os.system("rm default_variables.json")

    regions_dict = create_instance_dict(request)
    for region in list(regions_dict.keys()):
        with open(f"{region}-vars.json", "w") as outfile:
            json.dump(regions_dict[region], outfile)
        try:
            if not os.path.exists(f"./terraform.tfstate.d/{region}"):
                os.system(f"terraform workspace new {region}")
            else:
                os.system(f"terraform workspace select {region}")
            os.system(f"terraform apply -var-file={region}-vars.json -auto-approve")
        except Exception as e:
            os.chdir("../api")
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        finally:
            os.system(f"rm {region}-vars.json")

    os.system(f"terraform workspace select default")
    os.chdir("../api")
    return Response({"status": "success"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def variables(request, *args, **kwargs):
    with open("tf/my_variables.json", "r") as infile:
        data = json.load(infile)
    return Response(data, status=status.HTTP_200_OK)
