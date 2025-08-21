export type UserRole = 'admin' | 'team_member' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  avatar: string;
  createdAt: string;
}
