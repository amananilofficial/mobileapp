from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Media
from django.utils.safestring import mark_safe

class UserAdmin(BaseUserAdmin):
    # Display these fields in the admin list view
    list_display = ('username', 'email', 'full_name', 'phone_number', 'is_admin', 'is_staff', 'is_active')
    
    # Fields that can be searched
    search_fields = ('username', 'email', 'full_name', 'phone_number')
    
    # Filters on the side
    list_filter = ('is_admin', 'is_staff', 'is_active')
    
    # Fields to be used in editing the user model
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number', 'profile_photo')}),
        ('Permissions', {'fields': ('is_admin', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
    )
    
    # Fields used when creating a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'full_name', 'phone_number', 'profile_photo', 'password1', 'password2', 'is_admin', 'is_staff', 'is_active')}
        ),
    )
    
    ordering = ('username',)

class MediaAdmin(admin.ModelAdmin):
    list_display = ('file', 'owner')
    list_filter = ('owner',)
    search_fields = ('file', 'owner__username')

admin.site.register(User, UserAdmin)
admin.site.register(Media, MediaAdmin)