export const PASSWORD_RESET_EXPIRY_MINUTES = 10;

export const APP_ROUTS = {
  PROTECTED_ROUTES: ["/dashboard", "/profile", "/billing"],
  AUTH_ROUTES: [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
  PUBLIC_ROUTES: ["/", "/about", "/projects", "/organizations"],
};

export const API_ROUTES = {
  AUTH_PREFIX: "/api/auth",
};

export const UI_APP_ROUTES = {
  PUBLIC_NAVIGATION: {
    Home: "/",
    About: "/about",
    Projects: "/projects",
    Organizations: "/organizations",
    // Create project will be a button
  },
  AUTHORIZED_NAVIGATION_USER: {
    Contributions: "/contributions",
    Threads: "/threads",
    Profile: "/profile",
    // notification will be a sheet on the right side of the header, not a separate page
  },
  // Head navigation for organization members (owners/admins/members)
  AUTHORIZED_NAVIGATION_ORG: {
    "Go to organization": "/dashboard",
    Profile: "/profile",
  },
  // for left side navigation
  AUTHORIZED_NAVIGATION_ORG_OWNER: {
    Dashboard: "/dashboard",
    Projects: "/dashboard/projects",
    "Organization Settings": "/dashboard/settings",
    "Team Management": "/dashboard/team",
    Billing: "/dashboard/billing",
  },
  AUTH: {
    Login: "/login",
    "Sign Up": "/signup",
    "Forgot Password": "/forgot-password",
  },
};
