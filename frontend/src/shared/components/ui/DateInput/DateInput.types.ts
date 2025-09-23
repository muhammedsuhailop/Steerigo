export interface DateInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  emptyPlaceholder?: string;
  datePrefix?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
