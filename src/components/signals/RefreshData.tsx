import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type RefreshDataProps = {
  isLoading: boolean;
};

const RefreshData = ({ isLoading }: RefreshDataProps) => {
  const queryClient = useQueryClient();

  const handleRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
  };

  return (
    <div className="flex flex-col items-center justify-center h-96 w-full text-center space-y-4">
      {!isLoading && (
        <p className="text-slate-600 text-base font-medium">
          No signals are currently available.
        </p>
      )}

      {isLoading && (
        <p className="text-slate-500 text-sm">Loading signals...</p>
      )}

      <button
        onClick={handleRefetch}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Refreshing..." : "Reload Signals"}
      </button>
    </div>
  );
};

export default RefreshData;
