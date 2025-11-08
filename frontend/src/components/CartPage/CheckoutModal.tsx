import React, { useState, useEffect } from "react";

// --- SVG ICONS ---
// Copied from Login.tsx / previous version
const ExclamationTriangleIcon = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.515 2.625H3.72c-1.345 0-2.188-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Alert Component ---
// Copied from Login.tsx / previous version
interface AlertMessageProps {
  type: "error" | "success";
  message: string | null;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  if (!message) return null;
  const isError = type === "error";
  const bgColor = isError ? "bg-red-100" : "bg-green-100";
  const borderColor = isError ? "border-red-400" : "border-green-400";
  const textColor = isError ? "text-red-700" : "text-green-700";
  const Icon = ExclamationTriangleIcon;

  return (
    <div
      className={`p-3 rounded-lg border ${bgColor} ${borderColor} ${textColor} flex items-center space-x-2`}
      role="alert"
    >
      <Icon />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// --- Checkout Modal Component ---

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: {
    name: string;
    address: string;
    whatsapp: string;
  }) => void;
}

const CheckoutModal = ({ isOpen, onClose, onSubmit }: CheckoutModalProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setAddress("");
      setWhatsapp("");
      setFormError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !address || !whatsapp) {
      setFormError("Please fill in all fields.");
      return;
    }
    onSubmit({ name, address, whatsapp });
  };

  // Helper functions to clear error on input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (formError) setFormError(null);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    if (formError) setFormError(null);
  };
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(e.target.value);
    if (formError) setFormError(null);
  };

  return (
    <div
      // CHANGED: Added backdrop-blur-sm from Navbar Auth Modal
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        // CHANGED: Styling updated to match Navbar Auth Modal
        className="bg-black/75 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md text-white border-2 border-yellow-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Enter Shipping Details
        </h2>

        {/* This AlertMessage component is from Login.tsx */}
        <div className="mb-4">
          <AlertMessage type="error" message={formError} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              // CHANGED: Label style from Login.tsx
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              // CHANGED: Input style from Login.tsx
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              required
            />
          </div>

          {/* Address Field */}
          <div>
            <label
              // CHANGED: Label style from Login.tsx
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="address"
            >
              Shipping Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={handleAddressChange}
              // CHANGED: Textarea style from Login.tsx
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              rows={3}
              required
            />
          </div>

          {/* WhatsApp Field */}
          <div>
            <label
              // CHANGED: Label style from Login.tsx
              className="block text-sm font-medium text-gray-400 mb-1"
              htmlFor="whatsapp"
            >
              WhatsApp Number
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={handleWhatsappChange}
              // CHANGED: Input style from Login.tsx
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              placeholder="e.g., 0771234567"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              // CHANGED: Secondary button style (dark theme)
              className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              // CHANGED: Primary button style from Login.tsx
              className="px-5 py-2.5 rounded-lg font-semibold bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300"
            >
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
