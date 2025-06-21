import React, { useEffect, useState, useCallback } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: DeleteConfirmationModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const TRANSITION_DURATION = 300;

  const handleClose = useCallback(() => {
    setIsTransitioning(false);
    const timer = setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, TRANSITION_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const enterTimer = setTimeout(() => {
        setIsTransitioning(true);
      }, 10);
      return () => clearTimeout(enterTimer);
    } else {
      if (shouldRender) {
        handleClose();
      }
    }
  }, [isOpen, shouldRender, handleClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm
                  transition-opacity duration-${TRANSITION_DURATION} ${
        isTransitioning ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative
                    transform transition-all duration-${TRANSITION_DURATION} ease-out
                    ${isTransitioning ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Konfirmasi Hapus Produk</h4>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus produk{" "}
          <strong className="font-medium">{productName}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
