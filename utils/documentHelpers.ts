import { Document } from "@/components/data-types";



export const getDocumentTypeLabel = (type: Document['type']) => {
  const labels: Record<Document['type'], string> = {
    DO: 'Delivery Order',
    DD: 'Deployment Document',
    SWP: 'Safe Work Procedure',
    RA: 'Risk Assessment', 
    MOM_CERT: 'MOM Certificate',
    PE_CALC: 'PE Calculation',
    COS: 'Certificate of Serviceability',
    LEW: 'Licensed Electrical Worker',
    INSPECTION: 'Inspection Document',
    OFF_HIRE: 'Off-hire Form',
    ADHOC: 'Ad-hoc Deployment',
    ORIENTATION: 'Orientation Document'
  };
  
  return labels[type] || type;
};

export const getStatusColor = (status: 'valid' | 'expiring' | 'expired') => {
  switch (status) {
    case 'valid': return 'bg-green-100 text-green-800';
    case 'expiring': return 'bg-yellow-100 text-yellow-800';
    case 'expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
