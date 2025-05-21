
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  onClick,
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow p-6 transition-all hover:shadow-md", 
        onClick && "cursor-pointer hover:border-gondola-300",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span 
                className={cn(
                  "ml-2 text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className="p-2 bg-gondola-50 rounded-lg">
          {icon}
        </div>
      </div>
      {description && (
        <p className="mt-3 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
