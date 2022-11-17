from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import json
import os


@api_view(['POST'])
def launch(request, *args, **kwargs):
    with open('../tf/my_variables.json', 'w') as outfile:
        json.dump(request.data['json'], outfile)
    os.chdir('../tf')
    try:
        os.system('terraform apply -var-file=my_variables.json -auto-approve')
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response({'status': 'success'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def variables(request, *args, **kwargs):
    with open('../tf/my_variables.json', 'r') as infile:
        data = json.load(infile)
    return Response(data, status=status.HTTP_200_OK)