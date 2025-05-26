
import { format } from "date-fns";
import { FileText } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getDocumentTypeLabel, getStatusColor } from "@/utils/documentHelpers";
import { Document } from "../data-types";
import DocumentsTable from "@/components/common/DocumentsTable";

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
        <DocumentsTable
          documents={allDocuments.flatMap(({gondolaId, serialNumber, documents}) =>
            documents.map(document => ({
              ...document,
              serialNumber: serialNumber || "Project",
            }))
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
