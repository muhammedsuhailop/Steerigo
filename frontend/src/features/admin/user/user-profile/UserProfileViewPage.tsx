import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { UserProfileDetails, UserStatus } from "./components";
import { RiArrowLeftLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { UserAction } from "../user-management/components/UserManagement";
import { AdminLayout } from "@/features/admin/shared/components/AdminLayout/AdminLayout";

interface NetworkErrorPayload {
  data?: {
    message?: string;
  };
}

const UserProfileViewPage: React.FC = () => {
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

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<UserAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const profileData = apiResponse?.data;

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
      refetch();
    } catch (err) {
      const label = confirmAction
        ? actionButtonConfig[confirmAction]?.label
        : "Action";
      const networkError = err as NetworkErrorPayload;
      const msg = networkError?.data?.message || `${label} failed`;

      toast.error(msg);
      setErrorMsg(msg);
      setSuccessMsg(null);
      setConfirmOpen(false);
    } finally {
      setConfirmLoading(false);
      setConfirmAction(null);
    }
  };

  const getAvailableActions = (): UserAction[] => {
    if (!profileData?.userInfo) return [];
    const { status, isVerified } = profileData.userInfo;
    const actions: UserAction[] = [];

    if (!isVerified) {
      actions.push("verify");
      return actions;
    }

    // Cast status dynamically to isolate matching UI controls safely
    switch (status as UserStatus) {
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

  const getStatusBadgeClasses = (status?: string) => {
    switch (status as UserStatus) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
      case "Blocked":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending Verification":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderState = (content: React.ReactNode) => (
    <AdminLayout title="User Profile">
      <main className="flex-1 overflow-auto bg-gray-50 p-6">{content}</main>
    </AdminLayout>
  );

  if (isLoading)
    return renderState(
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="large" />
      </div>,
    );

  if (error || !profileData) {
    const networkError = error as NetworkErrorPayload;
    return renderState(
      <div className="max-w-4xl mx-auto">
        <Alert type="danger">
          <p className="font-semibold">
            {error ? "Error Loading User Profile" : "No user profile found"}
          </p>
          <p>{networkError?.data?.message || ""}</p>
          <Button onClick={() => navigate("/admin/users")} className="mt-4">
            Back to Users
          </Button>
        </Alert>
      </div>,
    );
  }

  const { userInfo, accountStats } = profileData;
  const availableActions = getAvailableActions();

  return (
    <AdminLayout title="User Profile">
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Messages */}
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

          {/* Header Section */}
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
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeClasses(userInfo?.status)}`}
              >
                {userInfo?.status || "Unknown"}
              </span>
            </div>
          </div>

          {/* Profile Details Layout */}
          <div className="grid grid-cols-1 gap-6 mt-6">
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

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => !confirmLoading && setConfirmOpen(false)}
        onConfirm={performConfirmedAction}
        title={
          confirmAction
            ? actionButtonConfig[confirmAction]?.label
            : "Confirm Action"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${actionButtonConfig[confirmAction]?.label?.toLowerCase()}?`
            : "Are you sure?"
        }
        confirmText={confirmLoading ? "Processing..." : "Yes, proceed"}
        cancelText="Cancel"
        variant="question"
        isLoading={confirmLoading}
        size="md"
      />
    </AdminLayout>
  );
};

export default UserProfileViewPage;
