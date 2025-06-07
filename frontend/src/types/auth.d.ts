export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  user = 'user',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}