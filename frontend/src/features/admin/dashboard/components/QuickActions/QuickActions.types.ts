export interface QuickActionsProps {}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "yellow" | "purple" | "red";
  path: string;
}

export interface ActionCardProps {
  action: QuickAction;
}
