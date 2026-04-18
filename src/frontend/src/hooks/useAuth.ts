import { useMutation } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { SessionToken } from "../backend.d";

const TOKEN_KEY = "auth_token";
const USERNAME_KEY = "auth_username";
const FULL_NAME_KEY = "auth_fullname";
const EMAIL_KEY = "auth_email";
const MOBILE_KEY = "auth_mobile";
const ADMIN_KEY = "isAdmin";

const ADMIN_EMAIL = "seeniraj489@gmail.com";
const ADMIN_NAME = "SEENIRAJ";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function getFullName(): string | null {
  return localStorage.getItem(FULL_NAME_KEY);
}

export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function getMobile(): string | null {
  return localStorage.getItem(MOBILE_KEY);
}

export function isLoggedIn(): boolean {
  const token = getToken();
  return token !== null && token.trim() !== "";
}

export function isAdmin(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function saveSession(
  token: string,
  username: string,
  fullName?: string,
  email?: string,
  mobile?: string,
): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
  if (fullName) localStorage.setItem(FULL_NAME_KEY, fullName);
  if (email) localStorage.setItem(EMAIL_KEY, email);
  if (mobile) localStorage.setItem(MOBILE_KEY, mobile);
}

export function saveAdminSession(email: string): void {
  localStorage.setItem(TOKEN_KEY, "admin-session-token");
  localStorage.setItem(USERNAME_KEY, ADMIN_NAME);
  localStorage.setItem(FULL_NAME_KEY, ADMIN_NAME);
  localStorage.setItem(EMAIL_KEY, email);
  localStorage.setItem(ADMIN_KEY, "true");
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(FULL_NAME_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(MOBILE_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export { ADMIN_EMAIL, ADMIN_NAME };

function getBackendActor() {
  const canisterId = process.env.CANISTER_BACKEND as string;
  const noopUpload = async (_file: unknown) => new Uint8Array();
  const noopDownload = async (_bytes: unknown) => {
    const { ExternalBlob } = await import("../backend");
    return ExternalBlob.fromURL("");
  };
  return createActor(canisterId, noopUpload as never, noopDownload as never);
}

type LoginResult =
  | { __kind__: "ok"; ok: SessionToken }
  | { __kind__: "err"; err: string };

type RegisterResult =
  | { __kind__: "ok"; ok: string }
  | { __kind__: "err"; err: string };

export function useLoginMutation() {
  return useMutation<
    LoginResult,
    Error,
    { username: string; password: string }
  >({
    mutationFn: async ({ username, password }) => {
      const actor = getBackendActor();
      return actor.loginUser(username, password);
    },
  });
}

export function useRegisterMutation() {
  return useMutation<
    RegisterResult,
    Error,
    {
      username: string;
      password: string;
      fullName: string;
      email: string;
      mobileNumber: string;
    }
  >({
    mutationFn: async ({
      username,
      password,
      fullName,
      email,
      mobileNumber,
    }) => {
      const actor = getBackendActor();
      return actor.registerUser(
        username,
        password,
        fullName,
        mobileNumber,
        email,
      );
    },
  });
}
