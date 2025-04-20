from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsViewerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['viewer', 'editor', 'admin']

class IsEditorUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['editor', 'admin']