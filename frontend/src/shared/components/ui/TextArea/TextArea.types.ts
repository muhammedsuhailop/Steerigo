export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}