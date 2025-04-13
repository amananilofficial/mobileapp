from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MediaViewSet,
    UserViewSet,
    login_user,
    logout_user,
    UserProfileView,
    update_profile,
    change_password,
    MediaUploadView
)
from django.conf import settings
from django.conf.urls.static import static

# Set up router for viewsets
router = DefaultRouter()
router.register(r'media', MediaViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    # Router endpoints for media and users
    path('', include(router.urls)),

    # Auth endpoints
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    path('auth/password/change/', change_password, name='change-password'),

    # User profile endpoints
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile-alias'),
    path('users/me/update/', update_profile, name='update-profile'),

    # Media upload endpoint
    path('media/', MediaUploadView.as_view(), name='media-upload'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
