from rest_framework import serializers
from .models import Media, User
import logging

logger = logging.getLogger(__name__)

class MediaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = ['id', 'file', 'file_url', 'owner', 'uploaded_at']
        read_only_fields = ['owner', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file and request else None

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'full_name',
            'phone_number',
            'profile_photo',
            'is_admin',
            'password'
        ]

    def get_profile_photo(self, obj):
        request = self.context.get('request')
        if obj.profile_photo and request:
            url = request.build_absolute_uri(obj.profile_photo.url)
            logger.debug(f"Generated profile photo URL: {url}")
            return url
        return None

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            full_name=validated_data.get('full_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            is_admin=validated_data.get('is_admin', False),
            password=validated_data['password']
        )
        user.profile_photo = validated_data.get('profile_photo', None)
        user.save()
        return user
