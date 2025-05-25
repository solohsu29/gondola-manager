

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import Link from "next/link";

interface DetailHeaderProps {
  ddNumber: string;
  onUploadDocument: () => void;
}

const DetailHeader = ({ ddNumber, onUploadDocument }: DetailHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <Button variant="outline" size="sm" className="mr-4" asChild>
        <Link href="/projects">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
      </Button>
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">Project {ddNumber}</h1>
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={onUploadDocument}>
          <FilePlus className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};

export default DetailHeader;
