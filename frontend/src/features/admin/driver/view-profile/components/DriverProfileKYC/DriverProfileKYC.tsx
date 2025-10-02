import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Badge,
  Modal,
} from "@/shared/components/ui";
import type { DriverProfileKYCProps } from "@/features/admin/shared/types";
import { EXTERNAL_API } from "@/shared";
import { LuMaximize2 } from "react-icons/lu";

export const DriverProfileKYC: React.FC<DriverProfileKYCProps> = ({
  items,
  onAction,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openModal = (url: string) => {
    setModalImage(url);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">License & ID Verification</h2>
      {/* grid with 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const badgeVariant = item.isVerified ? "success" : "warning";
          const badgeText = item.isVerified ? "Verified" : "Not Verified";

          return (
            <Card key={item.id} className="border rounded-lg">
              <CardHeader
                title={item.documentType}
                badge={{ text: badgeText, variant: badgeVariant }}
                className="bg-gray-100"
              />
              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {/* Left  */}
                <div className="space-y-2 text-sm">
                  <Detail label="Document No" value={item.documentNumber} />
                  <Detail
                    label="Date of Issue "
                    value={new Date(item.issueDate).toLocaleDateString()}
                  />
                  <Detail
                    label="Date of Expiry "
                    value={new Date(item.expiryDate).toLocaleDateString()}
                  />
                  <Detail
                    label="Submitted On"
                    value={new Date(item.submittedAt).toLocaleString()}
                  />
                </div>

                {/* Right */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ImagePreview url={item.urlFront} onEnlarge={openModal} />
                    <ImagePreview url={item.urlBack} onEnlarge={openModal} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="danger"
                      onClick={() => onAction(item.id, "Reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => onAction(item.id, "Approve")}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} size="xl">
        <img
          src={modalImage}
          alt="Full view"
          className="w-full h-auto object-contain"
        />
      </Modal>
    </>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface ImagePreviewProps {
  url: string;
  onEnlarge: (url: string) => void;
}

function ImagePreview({ url, onEnlarge }: ImagePreviewProps) {
  const cloudUrl = url.startsWith("http")
    ? url
    : `${EXTERNAL_API.CLOUDINARY_BASE}/${url}`;

  return (
    <div className="relative w-full pb-[75%] overflow-hidden rounded-lg bg-gray-50">
      <img
        src={cloudUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <button
        onClick={() => onEnlarge(cloudUrl)}
        className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
      >
        <LuMaximize2 />
      </button>
    </div>
  );
}
