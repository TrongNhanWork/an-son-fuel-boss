// src/lib/auth.ts
export type Role = "Manager" | "Cashier" | "Warehouse";

const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const USERNAME_KEY = "username";
const FULLNAME_KEY = "fullName";

export function setAuth(token: string, role: Role, username: string, fullName?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USERNAME_KEY, username);
  if (fullName !== undefined) localStorage.setItem(FULLNAME_KEY, fullName);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(FULLNAME_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): Role | null {
  const v = localStorage.getItem(ROLE_KEY);
  if (v === "Manager" || v === "Cashier" || v === "Warehouse") return v;
  return null;
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function getFullName(): string | null {
  return localStorage.getItem(FULLNAME_KEY);
}

export function getAuth() {
  return {
    token: getToken(),
    role: getRole(),
    username: getUsername(),
    fullName: getFullName(),
    isAuthed: !!getToken(),
  };
}

export function isAuthed() {
  return !!getToken();
}