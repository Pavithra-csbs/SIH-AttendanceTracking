from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import core_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@core_view(['GET'])
@permission_classes([IsAuthenticated])
def hello_user(request):
    return Response({"message": f"Hello, {request.user.username}!"})

from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Core app is working!"})
