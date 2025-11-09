import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import {
  Button,
  Badge,
  LoadingSpinner,
  Card,
  CardBody,
  Alert,
  ConfirmationModal,
} from "@/shared/components/ui";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { DriverDetails } from "../components/DriverDetails/DriverDetails";
import { VehicleDetails } from "../components/VehicleDetails/VehicleDetails";
import { DriverProfileKYC } from "../components/DriverProfileKYC/DriverProfileKYC";
import { RiArrowLeftLine } from "react-icons/ri";
import { toast } from "react-toastify";
import type { DriverProfileAction } from "../../../shared/types/adminDriverProfile.types";

const DriverProfileViewPage: React.FC = () => {
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

  const navigate = useNavigate();

  const {
    driverProfile,
    isLoading,
    isFetching,
    isUpdating,
    error,
    handleDriverAction,
    refreshProfile,
    availableActions,
    driverId,
  } = useDriverProfile();

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] =
    useState<DriverProfileAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Alert messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // open modal
  const openConfirm = (action: DriverProfileAction) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  // actually perform action after confirm
  const performConfirmedAction = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      const result = await handleDriverAction(confirmAction);
      const label = actionButtonConfig[confirmAction]?.label ?? confirmAction;

      toast.success(result.message || `${label} successful`);
      setSuccessMsg(result.message || `${label} successful`);
      setErrorMsg(null);

      setConfirmOpen(false);
      setConfirmAction(null);
      refreshProfile();
    } catch (err: any) {
      const label = confirmAction
        ? actionButtonConfig[confirmAction]?.label
        : "Action";
      const msg = err?.message || `${label} failed`;
      toast.error(msg);
      setErrorMsg(msg);
      setSuccessMsg(null);

      setConfirmOpen(false);
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  // auto-dismiss alerts after a timeout 4s
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    if (successMsg || errorMsg) {
      t = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 4000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [successMsg, errorMsg]);

  const actionButtonConfig: Record<
    DriverProfileAction,
    { label: string; variant: "success" | "danger" | "secondary" }
  > = {
    activate: { label: "Activate Driver", variant: "success" },
    suspend: { label: "Suspend Driver", variant: "danger" },
    block: { label: "Block Driver", variant: "danger" },
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
          <AdminTopbar onToggleSidebar={toggleSidebar} title="Driver Profile" />
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
          <AdminTopbar onToggleSidebar={toggleSidebar} title="Driver Profile" />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <Alert type="danger">
                <p className="font-semibold">Error Loading Driver Profile</p>
                <p>
                  {(error as any)?.data?.message ||
                    "Failed to load driver profile"}
                </p>
                <Button
                  onClick={() => navigate("/admin/drivers")}
                  className="mt-4"
                >
                  Back to Drivers
                </Button>
              </Alert>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!driverProfile) {
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
          <AdminTopbar onToggleSidebar={toggleSidebar} title="Driver Profile" />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <Alert type="danger">
                <p>No driver profile found</p>
                <Button
                  onClick={() => navigate("/admin/drivers")}
                  className="mt-4"
                >
                  Back to Drivers
                </Button>
              </Alert>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { driver, user, stats, kycDocuments } = driverProfile;

  const getStatusBadgeClasses = (status?: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending Verification":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
        <AdminTopbar onToggleSidebar={toggleSidebar} title="Driver Profile" />
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
                  onClick={() => navigate("/admin/drivers")}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Drivers
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={refreshProfile}
                    disabled={isFetching}
                  >
                    {isFetching ? "Refreshing..." : "Refresh"}
                  </Button>

                  {availableActions.map((action) => {
                    const cfg = actionButtonConfig[action];
                    return (
                      <Button
                        key={action}
                        variant={cfg?.variant ?? "secondary"}
                        size="sm"
                        onClick={() => openConfirm(action)}
                        disabled={isUpdating}
                      >
                        {cfg?.label ?? action}
                      </Button>
                    );
                  })}
                </div>

                {/* status badge */}
                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeClasses(
                      driver?.status
                    )}`}
                  >
                    {driver?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {/* Driver Details */}
              <div className="w-full bg-white rounded-lg shadow-md p-6">
                <DriverDetails driver={driver} user={user} stats={stats} />
              </div>

              {/* Vehicle Details*/}
              <div className="w-full bg-white rounded-lg shadow-md p-6">
                <VehicleDetails driver={driver} />
              </div>

              {/* KYC */}
              <div className="w-full bg-white rounded-lg shadow-md p-6">
                <DriverProfileKYC
                  kycDocuments={kycDocuments}
                  overallStatus={driver.kycStatus}
                  isUpdating={isUpdating}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
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
          confirmAction ? actionButtonConfig[confirmAction].label : "Confirm"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${actionButtonConfig[
                confirmAction
              ].label.toLowerCase()}?`
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

export default DriverProfileViewPage;
