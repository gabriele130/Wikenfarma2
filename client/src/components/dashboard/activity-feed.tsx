import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityLog } from "@shared/schema";

interface ActivityFeedProps {
  activities: ActivityLog[];
}

const actionIcons = {
  create: "fas fa-plus text-success",
  update: "fas fa-edit text-info",
  delete: "fas fa-trash text-error",
  sync: "fas fa-sync-alt text-warning",
  ship: "fas fa-truck text-info",
  confirm: "fas fa-check text-success",
};

const actionColors = {
  create: "bg-success",
  update: "bg-info",
  delete: "bg-error",
  sync: "bg-warning",
  ship: "bg-info",
  confirm: "bg-success",
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min fa`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h fa`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}g fa`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Attività Recenti</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nessuna attività recente
          </p>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <span 
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full ${
                          actionColors[activity.action as keyof typeof actionColors] || actionColors.create
                        } flex items-center justify-center ring-8 ring-white`}>
                          <i className={`${
                            actionIcons[activity.action as keyof typeof actionIcons] || actionIcons.create
                          } text-white text-sm`}></i>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time>{formatTimeAgo(activity.createdAt!)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
