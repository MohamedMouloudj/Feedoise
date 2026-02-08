export const PASSWORD_RESET_EXPIRY_MINUTES = 10;

export const EMAIL_VERIFICATION_EXPIRY_HOURS = 1;

export const APP_ROUTS = {
  PROTECTED_ROUTES: ["/space", "/profile", "/billing"],
  AUTH_ROUTES: [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/accept-invite",
    "/onboarding",
  ],
  PUBLIC_ROUTES: ["/", "/about", "/projects", "/organizations"],
};

export const API_ROUTES = {
  AUTH_PREFIX: "/api/auth",
};
