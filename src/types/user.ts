export type UserRole = "admin" | "manager" | "editor";

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
}
