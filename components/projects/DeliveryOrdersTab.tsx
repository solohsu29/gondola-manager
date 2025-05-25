
import { format } from "date-fns";
import { FileText } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeliveryOrder, Project } from "../data-types";
import { DeliveryOrderViewer } from "./DeliveryOrderViewer";

interface DeliveryOrdersTabProps {
  deliveryOrders: DeliveryOrder[];
  project: Project;
}

const DeliveryOrdersTab = ({ deliveryOrders, project }: DeliveryOrdersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Documents</CardTitle>
        <CardDescription>List of all deployment documents attached to this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DD Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryOrders.map((deliveryOrder) => (
                <TableRow key={deliveryOrder.id || 'default'}>
                  <TableCell className="font-medium">{deliveryOrder.number}</TableCell>
                  <TableCell>{format(deliveryOrder.date, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeliveryOrderViewer deliveryOrder={deliveryOrder} project={project} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryOrdersTab;
