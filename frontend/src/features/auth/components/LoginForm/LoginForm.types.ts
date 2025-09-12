export interface LoginFormProps {
  onSubmit?: (data: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
  className?: string;
  showGoogleAuth?: boolean;
  redirectTo?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
