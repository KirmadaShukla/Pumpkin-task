import toast from "react-hot-toast";

export const showErrorToast = (message) => {
  toast.error(message || "An error occurred.");
};

export const showSuccessToast = (message) => {
  toast.success(message || "Success!");
}; 