from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, update_session_auth_hash
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Media, User
from .serializers import MediaSerializer, UserSerializer
import logging

logger = logging.getLogger(__name__)

# Media ViewSet
@method_decorator(csrf_exempt, name='dispatch')
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Media.objects.all() if user.is_admin else Media.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.all() if user.is_admin else User.objects.filter(id=user.id)

    def get_serializer_context(self):
        return {'request': self.request}

# Auth: Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        response = Response({
            'token': token.key,
            'is_admin': user.is_admin,
            'username': user.username,
            'user_id': user.id,
        })
        # Add CSRF token to the response
        response['X-CSRFToken'] = get_token(request)
        return response
    else:
        return Response({'error': 'Invalid credentials'}, status=401)

# Auth: Logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)

# Profile: Get current user profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)

# Profile: Update profile
@api_view(['PUT', 'POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    if request.FILES:
        request.data['profile_photo'] = request.FILES['profile_photo']

    serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Profile: Change password
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response({'detail': 'Both old and new passwords are required'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(old_password):
        return Response({'detail': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)  # Keep user logged in after password change
    return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)

# Misc: Test endpoint
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_endpoint():
    return Response({'message': 'This is a test endpoint'})

# Optional: class-based profile view (can be removed if not used)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

class MediaUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.info(f"Received file upload request: {request.data}")
        
        # Ensure file is present
        if 'file' not in request.data:
            return Response({'detail': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Add the owner to the request data
        request.data['owner'] = request.user.id
        
        file_serializer = MediaSerializer(data=request.data, context={'request': request})
        if file_serializer.is_valid():
            file_serializer.save()
            logger.info(f"File saved successfully: {file_serializer.data}")
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"File upload failed: {file_serializer.errors}")
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
