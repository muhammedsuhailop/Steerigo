import React from "react";
import { useParams } from "react-router-dom";
import AdminDetailLayout from "../../../shared/pages/AdminDetailLayout";
import KYCDetailComponent from "../components/KYCDetailComponent";

const KYCRequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();

  if (!requestId) {
    return (
      <AdminDetailLayout title="KYC Request Details">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Invalid KYC Request ID</p>
        </div>
      </AdminDetailLayout>
    );
  }

  return (
    <AdminDetailLayout title="KYC Request Details">
      <KYCDetailComponent requestId={requestId} />
    </AdminDetailLayout>
  );
};

export default KYCRequestDetailPage;
