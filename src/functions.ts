
import { AuthStatus } from "./types/form.types";

// Helper function to check authentication status
export const isAuthenticated = (): AuthStatus => {
  // TODO: Change this to localStorage.getItem('token')
  // when full authentication is implemented
  return localStorage.getItem('AUTHENTICATED') === 'true';
};
