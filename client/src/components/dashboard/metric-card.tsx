import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  color: "primary" | "secondary" | "info" | "warning" | "success" | "error";
  isLoading?: boolean;
}

const colorClasses = {
  primary: "bg-primary bg-opacity-10 text-primary",
  secondary: "bg-secondary bg-opacity-10 text-secondary",
  info: "bg-info bg-opacity-10 text-info",
  warning: "bg-warning bg-opacity-10 text-warning",
  success: "bg-success bg-opacity-10 text-success",
  error: "bg-error bg-opacity-10 text-error",
};

const changeTypeClasses = {
  positive: "text-success",
  negative: "text-error",
  neutral: "text-warning",
};

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color, 
  isLoading = false 
}: MetricCardProps) {
  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
          <p className={`text-sm ${changeTypeClasses[changeType]}`}>
            {changeType === "positive" && <i className="fas fa-arrow-up mr-1"></i>}
            {changeType === "negative" && <i className="fas fa-arrow-down mr-1"></i>}
            {changeType === "neutral" && <i className="fas fa-clock mr-1"></i>}
            {change}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </Card>
  );
}
