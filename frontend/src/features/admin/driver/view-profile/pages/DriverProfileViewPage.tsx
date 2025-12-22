import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import {
  Button,
  LoadingSpinner,
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
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

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
    isUpdatingKYC,
    error,
    handleDriverAction,
    handleKYCStatusUpdate,
    refreshProfile,
    availableActions,
  } = useDriverProfile();

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] =
    useState<DriverProfileAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // KYC Approval confirmation modal state
  const [kycConfirmOpen, setKycConfirmOpen] = useState(false);
  const [kycConfirmLoading, setKycConfirmLoading] = useState(false);

  // Alert messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // open modal
  const openConfirm = (action: DriverProfileAction) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  // Open KYC approval confirmation
  const openKYCConfirm = () => {
    setKycConfirmOpen(true);
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
    } catch (err: unknown) {
      const label = confirmAction
        ? actionButtonConfig[confirmAction]?.label
        : "Action";
      const msg = getErrorMessage(err, `${label} failed`);
      toast.error(msg);
      setErrorMsg(msg);
      setSuccessMsg(null);

      setConfirmOpen(false);
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Handle KYC approval confirmation
  const performKYCApproval = async () => {
    setKycConfirmLoading(true);
    try {
      const result = await handleKYCStatusUpdate("Approved");
      toast.success(result.message || "KYC status updated to Approved");
      setSuccessMsg(result.message || "KYC status updated to Approved");
      setErrorMsg(null);
      setKycConfirmOpen(false);
      refreshProfile();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to update KYC status");
      toast.error(msg);
      setErrorMsg(msg);
      setSuccessMsg(null);
      setKycConfirmOpen(false);
    } finally {
      setKycConfirmLoading(false);
    }
  };

  // auto-dismiss alerts after a timeout 10s
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
                <p>{getErrorMessage(error, "Failed to load driver profile")}</p>

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
                  <RiArrowLeftLine className="w-5 h-5 mr-2" />
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

              {/* KYC  */}
              <div className="w-full bg-white rounded-lg shadow-md p-6">
                <DriverProfileKYC
                  kycDocuments={kycDocuments}
                  overallStatus={driver.kycStatus}
                  onMarkAsApproved={openKYCConfirm}
                  isUpdatingKYC={isUpdatingKYC}
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

      {/* KYC Approval Confirmation Modal */}
      <ConfirmationModal
        isOpen={kycConfirmOpen}
        onClose={() => {
          if (!kycConfirmLoading) {
            setKycConfirmOpen(false);
          }
        }}
        onConfirm={performKYCApproval}
        title="Mark KYC as Approved"
        message="Are you sure you want to mark this driver's overall KYC status as Approved? This will update the driver's KYC status in the system."
        confirmText={kycConfirmLoading ? "Updating..." : "Yes, Approve"}
        cancelText="Cancel"
        variant="question"
        isLoading={kycConfirmLoading}
        size="md"
      />
    </div>
  );
};

export default DriverProfileViewPage;
