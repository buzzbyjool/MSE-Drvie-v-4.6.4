import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../types/auth';

export function usePermissions() {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'Administrateur';
  };

  return {
    hasPermission,
    isAdmin,
  };
}