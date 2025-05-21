
// Document types
export type DocumentType = 
  | 'DO' // Delivery Order
  | 'DD' // Deployment Document
  | 'SWP' // Safe Work Procedure
  | 'RA' // Risk Assessment
  | 'MOM_CERT' // MOM Certificate
  | 'PE_CALC' // PE Calculation
  | 'COS' // Certificate of Serviceability
  | 'LEW' // Licensed Electrical Worker
  | 'INSPECTION' // Inspection document
  | 'OFF_HIRE' // Off-hire form
  | 'ADHOC' // Ad-hoc deployment
  | 'ORIENTATION'; // Orientation document

// Equipment status
export type GondolaStatus = 
  | 'deployed'
  | 'in-use'
  | 'under-inspection'
  | 'maintenance'
  | 'off-hired';

// Document with metadata
export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  uploadedAt: Date;
  expiryDate?: Date;
  fileUrl: string;
  status: 'valid' | 'expiring' | 'expired';
}

// Gondola equipment
export interface Gondola {
  id: string;
  serialNumber: string;
  status: GondolaStatus;
  location: {
    bay: string;
    floor: string;
    block: string;
    elevation: string;
  };
  deployedAt?: Date;
  lastInspection?: Date;
  nextInspection?: Date;
  documents: Document[];
  photos: {
    id: string;
    url: string;
    uploadedAt: Date;
    description: string;
  }[];
}

// Delivery Order
export interface DeliveryOrder {
  id: string;
  number: string;
  date: Date;
  fileUrl?: string;
}

// Transaction containing multiple gondolas
export interface Transaction {
  id: string;
  doNumber: string;
  clientName: string;
  siteName: string;
  createdAt: Date;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  gondolas: Gondola[];
  // Optional array of delivery orders (for multiple DOs support)
  deliveryOrders?: DeliveryOrder[];
}

// For notification panel
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  date: Date;
  read: boolean;
  actionLink?: string;
}

// Certificate expiry tracking
export interface CertificateExpiry {
  id: string;
  documentId: string;
  gondolaId: string;
  serialNumber: string;
  documentType: DocumentType;
  expiryDate: Date;
  daysRemaining: number;
  status: 'valid' | 'expiring' | 'expired';
}
