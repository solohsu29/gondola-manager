

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
import { Transaction } from "../data-types";
import Link from "next/link";

interface RecentProjectsProps {
  projects: Transaction[];
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
            {projects.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <Link href={`/projects/${transaction.id}`} className="text-gondola-600 hover:text-gondola-800 underline">
                    {transaction.doNumber}
                  </Link>
                </TableCell>
                <TableCell>{transaction.clientName}</TableCell>
                <TableCell>{transaction.siteName}</TableCell>
                <TableCell className="text-center">{transaction.gondolas.length}</TableCell>
                <TableCell>{formatDistanceToNow(transaction.createdAt, { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={
                    transaction.status === 'active' ? 'outline' :
                    transaction.status === 'completed' ? 'default' : 'destructive'
                  }>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
