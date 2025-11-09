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
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // open modal
  const openConfirm = (action: string) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  // actually perform action after confirm
  const performConfirmedAction = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      const result = await handleDriverAction(confirmAction as any);
      toast.success(result.message || `Driver ${confirmAction}d successfully`);
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${confirmAction} driver`);
      setConfirmOpen(false);
    } finally {
      setConfirmLoading(false);
    }
  };

  const statusButtonConfig: Record<
    "Pending Verification" | "Active" | "Suspended" | "Inactive",
    { label: string; variant: "success" | "danger" | "secondary" }
  > = {
    "Pending Verification": {
      label: "Mark Pending Verification",
      variant: "secondary",
    },
    Active: {
      label: "Activate Driver",
      variant: "success",
    },
    Suspended: {
      label: "Suspend Driver",
      variant: "danger",
    },
    Inactive: {
      label: "Set Inactive",
      variant: "danger",
    },
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
              <Alert variant="danger">
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
              <Alert variant="danger">
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
            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/admin/drivers")}
                >
                  <RiArrowLeftLine className="mr-1" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-sm text-gray-600">Driver Profile</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={refreshProfile}
                  disabled={isFetching}
                >
                  {isFetching ? "Refreshing..." : "Refresh"}
                </Button>
                {availableActions.map((status) => {
                  const cfg =
                    statusButtonConfig[
                      status as
                        | "Pending Verification"
                        | "Active"
                        | "Suspended"
                        | "Inactive"
                    ];

                  return (
                    <Button
                      key={status}
                      variant={cfg?.variant ?? "secondary"}
                      size="sm"
                      onClick={() => openConfirm(status)}
                      disabled={isUpdating}
                    >
                      {cfg?.label ?? status}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Driver Details & Stats */}
              <div className="lg:col-span-1">
                <DriverDetails driver={driver} user={user} stats={stats} />
              </div>

              {/* Right Column - Vehicle & KYC */}
              <div className="lg:col-span-2 space-y-6">
                <VehicleDetails driver={driver} />
                <DriverProfileKYC
                  kycDocuments={kycDocuments}
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
        title={`Confirm ${confirmAction ? confirmAction : ""}`}
        message={`Are you sure you want to ${
          confirmAction ? confirmAction : ""
        } this driver? `}
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
