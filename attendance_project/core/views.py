from django.shortcuts import render

# core/views.py
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import requests

class FaceAttendanceView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        img = request.FILES.get('image')
        device_id = request.data.get('device_id')
        lat = float(request.data.get('lat') or 0)
        lon = float(request.data.get('lon') or 0)
        # basic validation...
        # forward to internal recognition service
        rec_resp = requests.post(
            'http://recognition-service.local/verify',
            files={'image': img},
            headers={'X-INTERNAL-TOKEN': 'your-service-secret'}
        )
        # handle response, create Attendance, return result
        return Response(rec_resp.json(), status=200)

