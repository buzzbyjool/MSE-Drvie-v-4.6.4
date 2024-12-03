export type UserRole = 'User' | 'Administrateur' | 'Editeur' | 'Manager';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  region?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export const ROLES = {
  USER: 'User' as const,
  ADMIN: 'Administrateur' as const,
  EDITOR: 'Editeur' as const,
  MANAGER: 'Manager' as const,
};

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: ['view_routes'],
  [ROLES.ADMIN]: ['view_routes', 'upload_routes', 'manage_users', 'manage_settings', 'view_all_events'],
  [ROLES.EDITOR]: ['view_routes', 'upload_routes', 'view_most_events'],
  [ROLES.MANAGER]: ['view_routes', 'upload_routes', 'manage_users', 'view_most_events'],
} as const;