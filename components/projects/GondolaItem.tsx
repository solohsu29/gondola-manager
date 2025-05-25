
import { format } from "date-fns";
import { Package, FilePlus, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gondola } from "../data-types";
import { getDocumentTypeLabel, getStatusColor } from "@/utils/documentHelpers";
import Image from "next/image";


interface GondolaItemProps {
  gondola: Gondola;
  onUploadDocument: (gondolaId: string) => void;
}

const GondolaItem = ({ gondola, onUploadDocument }: GondolaItemProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Package className="h-5 w-5 text-gondola-600 mr-2" />
          <h3 className="text-lg font-medium">
            Gondola {gondola.serialNumber}
          </h3>
        </div>
        <Badge>{gondola.status}</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-medium">
            {gondola?.bay}, {gondola?.floor}, {gondola?.block}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Elevation</p>
          <p className="font-medium">{gondola?.elevation}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deployed Date</p>
          <p className="font-medium">
            {gondola.deployedAt ? format(gondola.deployedAt, 'dd MMM yyyy') : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last Inspection</p>
          <p className="font-medium">
            {gondola.lastInspection ? format(gondola.lastInspection, 'dd MMM yyyy') : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium mb-2">Documents</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gondola?.documents?.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{getDocumentTypeLabel(document.type)}</TableCell>
                  <TableCell className="font-medium">{document?.name.length > 15 ? document?.name.slice(0, 15) + '...' : document?.name}</TableCell>
                  <TableCell>{format(document.uploadedAt, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    {document.expiryDate 
                      ? format(document.expiryDate, 'dd MMM yyyy')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a href={document.fileUrl} target="_blank" rel="noreferrer">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Photos</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {gondola?.photos?.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden group">
              <Image
                                     src={`${photo?.url}` || "/placeholder.svg"}
                                     alt={photo?.id}
                                     className="object-cover h-[200px]"
                                     width={200}
                                     height={200}
                                   />
             
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUploadDocument(gondola.id)}
        >
          <FilePlus className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};

export default GondolaItem;
