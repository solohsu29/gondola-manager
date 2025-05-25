
import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundCard = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">Project not found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/projects">Return to Projects</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotFoundCard;
