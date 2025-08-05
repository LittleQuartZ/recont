import { toast } from "sonner";

/**
 * Maps backend error messages to user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "Unauthorized":
        return "Please sign in to continue";
      case "Counter not found":
        return "Counter not found or access denied";
      default:
        return error.message;
    }
  }
  return "Something went wrong. Please try again.";
}

/**
 * Shows an error toast with a user-friendly message
 */
export function showErrorToast(error: unknown) {
  const message = getErrorMessage(error);
  toast.error(message);
}

/**
 * Shows a success toast message
 */
export function showSuccessToast(message: string) {
  toast.success(message);
}

/**
 * Wraps an async operation with error handling and toast notifications
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    successMessage?: string;
    onError?: (error: unknown) => void;
  }
): Promise<T | null> {
  try {
    const result = await operation();
    if (options?.successMessage) {
      showSuccessToast(options.successMessage);
    }
    return result;
  } catch (error) {
    showErrorToast(error);
    options?.onError?.(error);
    return null;
  }
}