export interface AuthUser {
  username: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar?: string;
}

const TOKEN_KEY = "gda_erp_token";
const USER_KEY = "gda_erp_user";

export function saveAuthSession(
  token: string,
  user: AuthUser,
  rememberMe: boolean = true,
): void {
  if (typeof window === "undefined") return;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export const DEFAULT_GDA_USER: AuthUser = {
  username: "admin",
  name: "GDA Administrator",
  email: "admin@gda.gov.pk",
  role: "System Administrator",
  organization: "Galiyat Development Authority",
};
