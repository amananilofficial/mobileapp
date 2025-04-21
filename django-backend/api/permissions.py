from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsEditorUser(permissions.BasePermission):
    """
    Allows access to admin and editor users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'editor']

class IsViewerUser(permissions.BasePermission):
    """
    Allows access to admin, editor, and viewer users for viewing operations.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'editor', 'viewer']

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or staff to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.role == 'admin':
            return True
        
        # Editor can edit/delete
        if request.method in ['PUT', 'PATCH', 'DELETE'] and request.user.role == 'editor':
            return True
            
        # Viewer can only view
        if request.method in permissions.SAFE_METHODS and request.user.role == 'viewer':
            return True
            
        # Regular users can only access their own objects
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
            
        return False