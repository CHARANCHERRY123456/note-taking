interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export default function LoadingSpinner({ size = "medium", color = "blue-500" }: LoadingSpinnerProps) {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "h-4 w-4";
      case "medium":
        return "h-8 w-8";
      case "large":
        return "h-12 w-12";
      default:
        return "h-8 w-8";
    }
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-${color} ${getSizeClass()}`}></div>
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
