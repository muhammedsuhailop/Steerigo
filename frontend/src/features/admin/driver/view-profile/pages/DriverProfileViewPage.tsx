import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "../../../shared/components";
import {
  Button,
  Badge,
  LoadingSpinner,
  Card,
  CardBody,
  Alert,
} from "@/shared/components/ui";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { DriverDetails } from "../components/DriverDetails/DriverDetails";
import { VehicleDetails } from "../components/VehicleDetails/VehicleDetails";
import { DriverProfileKYC } from "../components/DriverProfileKYC/DriverProfileKYC";
import { RiCheckLine, RiCloseLine } from "react-icons/ri";

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
    driver,
    kycItems,
    loading,
    error,
    handleDriverAction,
    isActionLoading,
    actionMessage,
    actionMessageType,
    clearMessage,
  } = useDriverProfile();

  // Auto-clear
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(clearMessage, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage, clearMessage]);

  if (loading) return <LoadingSpinner size="xlarge" />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!driver) return <div>No driver found</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <AdminTopbar
          title="Admin - Driver Profile"
          onToggleSidebar={toggleSidebar}
        />

        <div className="p-6 overflow-auto space-y-6">
          {actionMessage && actionMessageType && (
            <Alert
              message={actionMessage}
              type={actionMessageType}
              onClose={clearMessage}
            />
          )}

          <Card>
            <CardBody className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <img
                  src={driver.profileImage || "/placeholder.png"}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold">{driver.name}</h1>
                  <p>{driver.email}</p>
                  <p>{driver.mobile}</p>
                </div>
              </div>
              <Badge
                variant={
                  driver.status === "Active"
                    ? "success"
                    : driver.status === "InReview"
                    ? "warning"
                    : "danger"
                }
              >
                {driver.status}
              </Badge>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DriverDetails driver={driver} />
            <VehicleDetails driver={driver} />
          </div>

          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-700 font-medium">
              {driver.status === "Active" &&
                "Do you want to block this driver?"}
              {driver.status === "Blocked" &&
                "Do you want to activate this driver?"}
              {driver.status === "InReview" &&
                "Do you want to update this driver’s status?"}
            </p>

            <div className="flex justify-center space-x-3">
              {driver.status === "Active" && (
                <Button
                  variant="danger"
                  isLoading={isActionLoading()}
                  onClick={() => handleDriverAction("block")}
                  leftIcon={<RiCloseLine />}
                >
                  Block
                </Button>
              )}

              {driver.status === "Blocked" && (
                <Button
                  variant="success"
                  isLoading={isActionLoading()}
                  onClick={() => handleDriverAction("unblock")}
                  leftIcon={<RiCheckLine />}
                >
                  Activate
                </Button>
              )}

              {driver.status === "InReview" && (
                <>
                  <Button
                    variant="success"
                    isLoading={isActionLoading()}
                    onClick={() => handleDriverAction("unblock")}
                    leftIcon={<RiCheckLine />}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="danger"
                    isLoading={isActionLoading()}
                    onClick={() => handleDriverAction("block")}
                    leftIcon={<RiCloseLine />}
                  >
                    Block
                  </Button>
                </>
              )}
            </div>
          </div>

          <DriverProfileKYC
            items={kycItems}
            onAction={(id, a) =>
              handleDriverAction(a === "Approve" ? "unblock" : "block")
            }
          />
        </div>
      </div>

      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DriverProfileViewPage;
