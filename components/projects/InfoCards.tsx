
import { User, MapPin, Package, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "../data-types";


interface InfoCardsProps {
  project: Project;
}

const InfoCards = ({ project }: InfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Client Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-2">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium">{project?.clientName}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">{project?.siteName}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Project Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status:</span>
            <Badge variant={
              project?.status === 'active' ? 'outline' :
              project?.status === 'completed' ? 'default' : 'destructive'
            }>
              {project?.status.charAt(0).toUpperCase() + project?.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Gondolas:</span>
            <span className="text-sm font-medium">{project?.gondolas.length}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">Start Date:</span>
            </div>
            <span className="text-sm font-medium">
              {format(project?.startDate, 'dd MMM yyyy')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">Created:</span>
            </div>
            <span className="text-sm font-medium">
              {format(project?.createdAt, 'dd MMM yyyy')}
            </span>
          </div>
          {project?.endDate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">End Date:</span>
              </div>
              <span className="text-sm font-medium">
                {format(project?.endDate, 'dd MMM yyyy')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
