export interface AuthFormProps {
  formType: 'Login' | 'Register'
  onSubmit: (username: string, password: string) => void
}

// Type for authentication status (adjust as needed)
export type AuthStatus = boolean