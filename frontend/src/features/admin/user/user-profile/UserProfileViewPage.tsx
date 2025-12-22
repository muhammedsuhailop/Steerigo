import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import {
  Button,
  LoadingSpinner,
  Alert,
  ConfirmationModal,
} from "@/shared/components/ui";
import {
  useGetUserProfileByIdQuery,
  useUpdateUserStatusMutation,
} from "../../shared/services/adminApi";
import { UserProfileDetails, UserActivityCard } from "./components";
import { RiArrowLeftLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { UserAction } from "../user-management/components/UserManagement";

const UserProfileViewPage: React.FC = () => {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetUserProfileByIdQuery(userId || "", { skip: !userId });

  const [updateUserAction, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const profileData = apiResponse?.data;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<UserAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openConfirm = (action: UserAction) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const performConfirmedAction = async () => {
    if (!confirmAction || !userId) return;
    setConfirmLoading(true);
    try {
      const result = await updateUserAction({
        userId,
        action: confirmAction,
      }).unwrap();

      const label = actionButtonConfig[confirmAction]?.label ?? confirmAction;
      toast.success(result.message || `${label} successful`);
      setSuccessMsg(result.message || `${label} successful`);
      setErrorMsg(null);

      setConfirmOpen(false);
      setConfirmAction(null);
      refetch();
    } catch (err: any) {
      const label = confirmAction
        ? actionButtonConfig[confirmAction]?.label
        : "Action";
      const msg = err?.data?.message || `${label} failed`;
      toast.error(msg);
      setErrorMsg(msg);
      setSuccessMsg(null);

      setConfirmOpen(false);
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    if (successMsg || errorMsg) {
      t = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 10000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [successMsg, errorMsg]);

  const actionButtonConfig: Record<
    UserAction,
    { label: string; variant: "success" | "danger" }
  > = {
    activate: { label: "Activate", variant: "success" },
    suspend: { label: "Suspend", variant: "danger" },
    block: { label: "Block", variant: "danger" },
    verify: { label: "Verify", variant: "success" },
    deactivate: { label: "Block", variant: "danger" },
  };

  const getAvailableActions = (): UserAction[] => {
    if (!profileData?.userInfo) return [];

    const { status, isVerified } = profileData.userInfo;
    const actions: UserAction[] = [];

    if (!isVerified) {
      actions.push("verify");
      return actions;
    }

    switch (status) {
      case "Inactive":
        actions.push("activate");
        break;

      case "Active":
        actions.push("suspend");
        break;

      case "Suspended":
        actions.push("activate");
        break;
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  const getStatusBadgeClasses = (status?: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />
        <div
          className="flex-1 flex flex-col"
          style={{
            marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
            transition: "margin-left 0.3s ease",
          }}
        >
          <AdminTopbar onToggleSidebar={toggleSidebar} title="User Profile" />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner size="large" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />
        <div
          className="flex-1 flex flex-col"
          style={{
            marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
            transition: "margin-left 0.3s ease",
          }}
        >
          <AdminTopbar onToggleSidebar={toggleSidebar} title="User Profile" />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <Alert type="danger">
                <p className="font-semibold">Error Loading User Profile</p>
                <p>
                  {(error as any)?.data?.message ||
                    "Failed to load user profile"}
                </p>
                <Button
                  onClick={() => navigate("/admin/users")}
                  className="mt-4"
                >
                  Back to Users
                </Button>
              </Alert>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen">
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />
        <div
          className="flex-1 flex flex-col"
          style={{
            marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
            transition: "margin-left 0.3s ease",
          }}
        >
          <AdminTopbar onToggleSidebar={toggleSidebar} title="User Profile" />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <Alert type="danger">
                <p>No user profile found</p>
                <Button
                  onClick={() => navigate("/admin/users")}
                  className="mt-4"
                >
                  Back to Users
                </Button>
              </Alert>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { userInfo, accountStats, activityStatus, metadata } = profileData;

  return (
    <div className="flex h-screen">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className="flex-1 flex flex-col"
        style={{
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
        }}
      >
        <AdminTopbar onToggleSidebar={toggleSidebar} title="User Profile" />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Alerts (success / error) */}
            <div className="max-w-3xl mb-4">
              {successMsg && (
                <Alert
                  type="success"
                  message={successMsg}
                  onClose={() => setSuccessMsg(null)}
                  className="mb-4"
                />
              )}
              {errorMsg && (
                <Alert
                  type="danger"
                  message={errorMsg}
                  onClose={() => setErrorMsg(null)}
                  className="mb-4"
                />
              )}
            </div>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <RiArrowLeftLine className="w-5 h-5 mr-2" />
                  Back to Users
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userInfo?.name || "User"}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    {isFetching ? "Refreshing..." : "Refresh"}
                  </Button>

                  {availableActions.map((action) => {
                    const cfg = actionButtonConfig[action];
                    return (
                      <Button
                        key={action}
                        variant={cfg?.variant ?? "dark"}
                        size="sm"
                        onClick={() => openConfirm(action)}
                        disabled={isUpdating}
                      >
                        {cfg?.label ?? action}
                      </Button>
                    );
                  })}
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeClasses(
                      userInfo?.status
                    )}`}
                  >
                    {userInfo?.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {/* User Profile Details */}
              <div className="w-full bg-white rounded-lg shadow-md p-6">
                <UserProfileDetails
                  userInfo={userInfo}
                  stats={accountStats}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => {
          if (!confirmLoading) {
            setConfirmOpen(false);
            setConfirmAction(null);
          }
        }}
        onConfirm={performConfirmedAction}
        title={
          confirmAction
            ? actionButtonConfig[confirmAction]?.label
            : "Confirm Action"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${actionButtonConfig[
                confirmAction
              ]?.label?.toLowerCase()}?`
            : "Are you sure?"
        }
        confirmText={confirmLoading ? "Processing..." : "Yes, proceed"}
        cancelText="Cancel"
        variant="question"
        isLoading={confirmLoading}
        size="md"
      />
    </div>
  );
};

export default UserProfileViewPage;
