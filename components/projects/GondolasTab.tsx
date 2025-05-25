
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GondolaItem from "./GondolaItem";
import { Gondola } from "../data-types";


interface GondolasTabProps {
  gondolas: Gondola[];
  onUploadDocument: (gondolaId: string) => void;
}

const GondolasTab = ({ gondolas, onUploadDocument }: GondolasTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gondolas</CardTitle>
        <CardDescription>List of gondolas associated with this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {gondolas?.map((gondola) => (
            <GondolaItem 
              key={gondola.id} 
              gondola={gondola} 
              onUploadDocument={onUploadDocument}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GondolasTab;
