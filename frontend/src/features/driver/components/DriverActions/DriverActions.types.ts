export interface DriverActionsProps {
  isOnline: boolean;
  onGoOnline: () => void;
  onScheduleAvailability: () => void;
  onViewEarnings: () => void;
  loading?: boolean;
  className?: string;
}
