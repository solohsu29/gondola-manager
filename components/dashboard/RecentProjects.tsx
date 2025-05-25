

import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Project } from "../data-types";
import Link from "next/link";

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects = ({ projects }: RecentProjectsProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">View all</Link>
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">DO Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Site</TableHead>
              <TableHead className="w-[100px] text-center">Gondolas</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link href={`/projects/${project.id}`} className="text-gondola-600 hover:text-gondola-800 underline">
                    {project.deliveryOrders && project.deliveryOrders.length > 0
  ? project.deliveryOrders.map((doObj) => doObj.number).join(', ')
  : 'No DO' }
                  </Link>
                </TableCell>
                <TableCell>{project.clientName}</TableCell>
                <TableCell>{project.siteName}</TableCell>
                <TableCell className="text-center">{project.gondolas.length}</TableCell>
                <TableCell>{formatDistanceToNow(project.createdAt, { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={
                    project.status === 'active' ? 'outline' :
                    project.status === 'completed' ? 'default' :
                    project.status === 'cancelled' ? 'destructive' : 'secondary'
                  } className={
                    project.status === 'active' ? 'text-green-600 border-green-600' :
                    project.status === 'completed' ? 'text-white' :
                    project.status === 'cancelled' ? 'text-red-600 border-red-600' :
                    'text-gray-400'
                  }>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentProjects;
