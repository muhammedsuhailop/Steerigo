// Layout Components
export { AdminSidebar } from '../shared/components/AdminSidebar';
export { AdminTopbar } from '../shared/components/AdminTopbar';

// Dashboard Components
export { DashboardOverview } from '../dashboard/components/DashboardOverview';
export { RecentActivity } from '../dashboard/components/RecentActivity';
export { QuickActions } from '../dashboard/components/QuickActions';
export { UserStatusBadge } from '../user-management/components/UserStatusBadge';
export { SystemStatus } from '../dashboard/components/SystemStatus';
export { RecentUsers } from '../dashboard/components/RecentUsers'; 

// Management Components
export { UserManagement } from '../user-management/components/UserManagement';


// Types
export type { AdminSidebarProps, SidebarItem } from '../shared/components/AdminSidebar';
export type { AdminTopbarProps } from '../shared/components/AdminTopbar';
export type { DashboardOverviewProps, OverviewStat } from '../dashboard/components/DashboardOverview';
export type { RecentActivityProps, ActivityItemType } from '../dashboard/components/RecentActivity';
export type { QuickActionsProps, QuickAction } from '../dashboard/components/QuickActions';
export type { UserManagementProps, User, UserFilters } from '../user-management/components/UserManagement';
export type { SystemStatusProps } from '../dashboard/components/SystemStatus';
export type { RecentUsersProps } from '../dashboard/components/RecentUsers';   
