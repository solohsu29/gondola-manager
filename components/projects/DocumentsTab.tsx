
import { format } from "date-fns";
import { FileText } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getDocumentTypeLabel, getStatusColor } from "@/utils/documentHelpers";
import { Document } from "../data-types";


interface DocumentsTabProps {
  allDocuments: {
    gondolaId: string | null;
    serialNumber: string | null;
    documents: Document[];
  }[];
}

const DocumentsTab = ({ allDocuments }: DocumentsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Documents</CardTitle>
        <CardDescription>Complete list of all documents across all gondolas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gondola</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDocuments.flatMap(({gondolaId, serialNumber, documents}) => 
                documents.map(document => (
                  <TableRow key={`${gondolaId}-${document.id}`}>
                    <TableCell>{serialNumber || "Project"}</TableCell>
                    <TableCell>{getDocumentTypeLabel(document.type)}</TableCell>
                    <TableCell className="font-medium">{document?.name.length > 15 ? document?.name.slice(0, 15) + '...' : document?.name}</TableCell>
                    <TableCell>{format(document.uploadedAt, 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {document.status === 'valid' ? 'Valid' : 'Expired'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <a href={document.fileUrl} target="_blank" rel="noreferrer" download={document.name}>
  <FileText className="h-4 w-4 mr-1" />
  Download
</a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
