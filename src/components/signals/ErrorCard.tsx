import { AlertTriangle } from "lucide-react";

const ErrorCard = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-red-500 space-y-4">
      <AlertTriangle className="w-10 h-10" />
      <p className="text-lg font-semibold">Oops! Something went wrong.</p>
      <p className="text-sm text-red-400">
        Unable to fetch signals. Please try again later.
      </p>
    </div>
  );
};

export default ErrorCard;
