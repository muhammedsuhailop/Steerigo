export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  title: string;
  className?: string;
  badge?: {
    text: string;
    variant?:
      | "success"
      | "warning"
      | "danger"
      | "secondary"
      | "outline"
      | "info";
  };
}
