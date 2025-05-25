
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CertificateExpiry } from "../data-types";
import Link from "next/link";

interface CertificateExpiryWidgetProps {
  certificates: CertificateExpiry[];
}

const CertificateExpiryWidget = ({ certificates }: CertificateExpiryWidgetProps) => {
  // Only show certificates with status 'valid' or 'expired'
  const filteredCertificates = certificates.filter(cert => cert.status === 'valid' || cert.status === 'expired');
  // Sort: expired first, then valid by soonest expiry
  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    if (a.status === 'expired' && b.status !== 'expired') return -1;
    if (a.status !== 'expired' && b.status === 'expired') return 1;
    return a.daysRemaining - b.daysRemaining;
  });

  const getCertificateTypeLabel = (type: string): string => {
    switch(type) {
      case 'MOM_CERT': return 'MOM Certificate';
      case 'COS': return 'Certificate of Serviceability';
      case 'LEW': return 'LEW Certificate';
      default: return type;
    }
  };
console.log('certificates',certificates)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Certificate Expiry Status</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <ul className="divide-y divide-gray-200">
          {sortedCertificates.length === 0 ? (
            <li className="py-4 px-6 text-center text-gray-500">
              No certificates to display
            </li>
          ) : (
            sortedCertificates.map((cert) => (
              <li key={cert.id} className="py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {getCertificateTypeLabel(cert.documentType)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Gondola: {cert.serialNumber}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={
                      cert.status === 'expired' ? 'destructive' : 'default'
                    }>
                      {cert.status === 'expired' ? 'Expired' : 
                      `Valid until ${formatDistanceToNow(cert.expiryDate, { addSuffix: true })}`}
                    </Badge>

                    
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/documents">View all certificates</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateExpiryWidget;
