import { URLS } from "@/shared";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";

interface ImageGalleryProps {
  frontImages: string[];
  backImages: string[];
  docType: string;
}

interface ImageModal {
  isOpen: boolean;
  image: string | null;
  title: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  frontImages,
  backImages,
  docType,
}) => {
  const [modal, setModal] = useState<ImageModal>({
    isOpen: false,
    image: null,
    title: "",
  });

  const handleImageClick = (image: string, side: string) => {
    setModal({
      isOpen: true,
      image,
      title: `${docType} - ${side}`,
    });
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      image: null,
      title: "",
    });
  };

  const getFullImageUrl = (publicId: string): string => {
    // Do not remove .jpg if backend returns publicId without extension but handles .jpg fine!
    return URLS.CLOUDINARY_BASE + publicId + ".jpg";
  };

  const renderImageThumbnail = (image: string, side: string, index: number) => (
    <div
      key={index}
      onClick={() => handleImageClick(image, side)}
      className="relative group cursor-pointer rounded-xl shadow-sm hover:shadow-lg bg-white overflow-hidden transition-all duration-300 border border-gray-100"
    >
      {/* Image wrapper with fixed aspect ratio */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={`${docType} ${side} ${index}`}
          crossOrigin="anonymous"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-90"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300">
        <FiEye className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Label Badge */}
      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow">
        {side}
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {docType} Images ({frontImages.length + backImages.length} image
            {frontImages.length + backImages.length !== 1 ? "s" : ""})
          </h3>

          <div className="flex flex-wrap gap-4">
            {[
              ...frontImages.map((img) => ({ img, side: "Front" })),
              ...backImages.map((img) => ({ img, side: "Back" })),
            ].map(({ img, side }, index) => (
              <div key={index} className="w-40">
                {renderImageThumbnail(getFullImageUrl(img), side, index)}
              </div>
            ))}
          </div>

          {frontImages.length === 0 && backImages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No images available for this document
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {modal.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {modal.title}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiEye className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {modal.image && (
                <img
                  src={modal.image}
                  alt={modal.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <a
                href={modal.image || "#"}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Download Image
              </a>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
