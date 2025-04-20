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
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Media, User, MediaBatch
from .serializers import MediaSerializer, UserSerializer, MediaBatchSerializer
import logging
from .permissions import IsAdminUser, IsViewerUser, IsEditorUser

logger = logging.getLogger(__name__)

# Media ViewSet
@method_decorator(csrf_exempt, name='dispatch')
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Check if user has permission to delete
            if request.user == instance.owner or request.user.role == 'admin':
                # Delete the file from storage
                if instance.file:
                    instance.file.delete(save=False)
                self.perform_destroy(instance)
                return Response({'message': 'Image deleted successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsEditorUser]
        else:
            permission_classes = [IsViewerUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'editor', 'viewer']:
            return Media.objects.all()
        return Media.objects.filter(owner=user)

# Update UserViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

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

# Optional: class-based profile view (can be removed if not used)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

# Add MediaBatchViewSet
class MediaBatchViewSet(viewsets.ModelViewSet):
    queryset = MediaBatch.objects.all()
    serializer_class = MediaBatchSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsEditorUser]
        else:
            permission_classes = [IsViewerUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'editor', 'viewer']:
            return MediaBatch.objects.all()
        return MediaBatch.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# Update MediaUploadView to handle batch uploads
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
        
        # Handle batch information
        batch_id = request.data.get('batch')
        batch_referral_id = request.data.get('batch_referral_id')
        batch_title = request.data.get('batch_title')
        
        # Prepare data for serializer
        data = request.data.copy()
        if batch_referral_id:
            data['batch_referral_id'] = batch_referral_id
        if batch_title:
            data['batch_title'] = batch_title
        
        file_serializer = MediaSerializer(data=data, context={'request': request})
        if file_serializer.is_valid():
            file_serializer.save()
            logger.info(f"File saved successfully: {file_serializer.data}")
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"File upload failed: {file_serializer.errors}")
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add batch upload endpoint for multiple files
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def batch_upload(request):
    if 'files[]' not in request.FILES:
        return Response({'detail': 'No files uploaded'}, status=status.HTTP_400_BAD_REQUEST)
    
    batch_title = request.data.get('title')
    if not batch_title:
        return Response({'detail': 'Batch title is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create a new batch
    batch = MediaBatch.objects.create(
        owner=request.user,
        title=batch_title
    )
    
    # Process each file
    uploaded_files = []
    files = request.FILES.getlist('files[]')
    
    # Check minimum requirement only
    if len(files) < 20:
        batch.delete()
        return Response({'detail': 'Minimum 20 files required for batch upload'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Process all files (no maximum limit)
    for file in files:
        media = Media.objects.create(
            owner=request.user,
            batch=batch,
            file=file,
            title=request.data.get('file_title', '')
        )
        uploaded_files.append(MediaSerializer(media, context={'request': request}).data)
    
    return Response({
        'batch': MediaBatchSerializer(batch, context={'request': request}).data,
        'files': uploaded_files
    }, status=status.HTTP_201_CREATED)

# Add this new view (keep all existing imports and views)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def batch_images(request, batch_id):
    try:
        batch = MediaBatch.objects.get(id=batch_id)
        files = request.FILES.getlist('images')
        
        for file in files:
            Media.objects.create(
                file=file,
                owner=request.user,
                batch=batch,
                title=file.name
            )
        
        return Response({'message': 'Images added successfully'}, status=status.HTTP_200_OK)
    except MediaBatch.DoesNotExist:
        return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Add these imports at the top
from django.http import FileResponse
from reportlab.pdfgen import canvas
from io import BytesIO
import os

# Add these view functions
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_media_batches(request):
    batches = MediaBatch.objects.filter(owner=request.user)
    serializer = MediaBatchSerializer(batches, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_batch(request):
    batch_id = request.data.get('batch_id')
    try:
        batch = MediaBatch.objects.get(id=batch_id, owner=request.user)
        files = request.FILES.getlist('files[]')
        
        for file in files:
            Media.objects.create(
                owner=request.user,
                batch=batch,
                file=file
            )
        
        return Response({'message': 'Images added successfully'})
    except MediaBatch.DoesNotExist:
        return Response({'error': 'Batch not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_batch_pdf(request, batch_id):
    try:
        batch = MediaBatch.objects.get(id=batch_id, owner=request.user)
        buffer = BytesIO()
        p = canvas.Canvas(buffer)

        # Add batch info
        p.drawString(100, 800, f"Batch Referral ID: {batch.referral_id}")
        p.drawString(100, 780, f"Title: {batch.title}")
        
        # Add images info
        y_position = 750
        for media in batch.media_files.all():
            p.drawString(100, y_position, f"Image: {media.file.name}")
            y_position -= 20

        p.showPage()
        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f'batch_{batch.referral_id}.pdf')
    
    except MediaBatch.DoesNotExist:
        return Response({'error': 'Batch not found'}, status=404)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Fix: permission_classes instead of permission_class  # Only admin users can access the list
