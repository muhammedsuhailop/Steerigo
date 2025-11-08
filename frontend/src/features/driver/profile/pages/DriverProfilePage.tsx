import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { DriverSidebar, DriverTopbar } from "../../shared/components";
import { Footer } from "@/features/public/components";
import { DriverProfileHeader } from "../components/DriverProfileHeader";
import { DriverProfileDetails } from "../components/DriverProfileDetails";
import { DriverKYCStatus } from "../components/DriverKYCStatus";
import { DriverLicenseInfo } from "../components/DriverLicenseInfo";
import { Alert } from "@/shared/components/ui/Alert";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EligibilitySection } from "../components/EligibilitySection";
import { AddKYCModal } from "../components/AddKYCModal";

const DriverProfilePage: React.FC = () => {
  const { user } = useAuth();
  const {
    profile,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess,
    refetch,
  } = useDriverProfile();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [isAddKYCModalOpen, setIsAddKYCModalOpen] = useState(false);

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

  // Initial loading (no profile yet)
  if (isLoading && !profile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <DriverSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />

        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        >
          <DriverTopbar onToggleSidebar={toggleSidebar} />

          <main className="flex-1 flex items-center justify-center px-6 py-8 max-w-4xl mx-auto w-full">
            <LoadingSpinner />
          </main>
        </div>
      </div>
    );
  }

  // Error (no profile)
  if (error && !profile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <DriverSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />

        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        >
          <DriverTopbar onToggleSidebar={toggleSidebar} />

          <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
            <Alert type="danger" message={error} onClose={clearError} />
          </main>
        </div>
      </div>
    );
  }

  // No profile at all (fallback)
  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <DriverSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />

        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        >
          <DriverTopbar onToggleSidebar={toggleSidebar} />

          <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
            <Alert
              type="danger"
              message="Could not load driver profile. Please try again later."
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Topbar */}
        <DriverTopbar onToggleSidebar={toggleSidebar} title="Profile" />

        {/* Alert Banner (matches desired layout) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          {error && (
            <Alert type="danger" message={error} onClose={clearError} />
          )}
          {success && (
            <Alert type="success" message={success} onClose={clearSuccess} />
          )}
        </div>

        {/* Main Content  */}
        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <DriverProfileHeader
                profile={profile}
                isLoading={isLoading}
                onEditClick={() => setEditMode(!editMode)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Details */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm w-full">
              <DriverProfileDetails
                profile={profile}
                isLoading={isLoading}
                editMode={editMode}
                onEditModeChange={setEditMode}
              />
            </div>

            {/* License Info */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm w-full">
              <DriverLicenseInfo
                license={profile.license}
                isVerified={profile.license?.licenseVerified}
              />
            </div>

            {/* KYC Status */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm w-full">
              <DriverKYCStatus
                kyc={profile.kyc}
                isLoading={isLoading}
                onDocumentAdded={() => refetch()}
                onAddKYCClick={() => setIsAddKYCModalOpen(true)}
              />
            </div>

            {/* Eligibility Section */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm w-full">
              <EligibilitySection
                gearTypes={profile.eligibleGearTypes}
                bodyTypes={profile.eligibleBodyTypes}
                onUpdate={() => refetch()}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Add KYC Modal */}
      <AddKYCModal
        isOpen={isAddKYCModalOpen}
        onClose={() => setIsAddKYCModalOpen(false)}
        onSuccess={() => {
          setIsAddKYCModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default DriverProfilePage;
