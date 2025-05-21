import { CertificateExpiry, Transaction,Notification } from "../data-types";



// Current date for calculating relative dates
const currentDate = new Date();

// Helper to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};

// Helper to subtract days from a date
const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
};

// Mock projects
export const mockProjects: Transaction[] = [
  {
    id: 't1',
    doNumber: 'DO-2023-0001',
    clientName: 'Apex Construction',
    siteName: 'Marina Bay Tower',
    createdAt: subtractDays(currentDate, 30),
    startDate: subtractDays(currentDate, 28),
    status: 'active',
    gondolas: [
      {
        id: 'g1',
        serialNumber: 'GND-001-2023',
        status: 'deployed',
        location: {
          bay: 'Bay A',
          floor: '15',
          block: 'Block 1',
          elevation: 'North',
        },
        deployedAt: subtractDays(currentDate, 28),
        lastInspection: subtractDays(currentDate, 7),
        nextInspection: addDays(currentDate, 7),
        documents: [
          {
            id: 'd1',
            type: 'DD',
            name: 'Deployment Document',
            uploadedAt: subtractDays(currentDate, 28),
            fileUrl: '/documents/dd-001.pdf',
            status: 'valid',
          },
          {
            id: 'd2',
            type: 'SWP',
            name: 'Safe Work Procedure',
            uploadedAt: subtractDays(currentDate, 28),
            fileUrl: '/documents/swp-001.pdf',
            status: 'valid',
          },
          {
            id: 'd3',
            type: 'MOM_CERT',
            name: 'MOM Certificate',
            uploadedAt: subtractDays(currentDate, 28),
            expiryDate: addDays(currentDate, 30),
            fileUrl: '/documents/mom-001.pdf',
            status: 'expiring',
          },
        ],
        photos: [
          {
            id: 'p1',
            url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            uploadedAt: subtractDays(currentDate, 28),
            description: 'Initial deployment photo',
          }
        ],
      },
      {
        id: 'g2',
        serialNumber: 'GND-002-2023',
        status: 'in-use',
        location: {
          bay: 'Bay B',
          floor: '20',
          block: 'Block 2',
          elevation: 'South',
        },
        deployedAt: subtractDays(currentDate, 25),
        lastInspection: subtractDays(currentDate, 4),
        nextInspection: addDays(currentDate, 10),
        documents: [
          {
            id: 'd4',
            type: 'DD',
            name: 'Deployment Document',
            uploadedAt: subtractDays(currentDate, 25),
            fileUrl: '/documents/dd-002.pdf',
            status: 'valid',
          },
          {
            id: 'd5',
            type: 'COS',
            name: 'Certificate of Serviceability',
            uploadedAt: subtractDays(currentDate, 25),
            expiryDate: addDays(currentDate, 60),
            fileUrl: '/documents/cos-002.pdf',
            status: 'valid',
          },
        ],
        photos: [
          {
            id: 'p2',
            url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
            uploadedAt: subtractDays(currentDate, 25),
            description: 'Deployment verification',
          }
        ],
      }
    ]
  },
  {
    id: 't2',
    doNumber: 'DO-2023-0002',
    clientName: 'Skyline Developers',
    siteName: 'Orchard Gateway',
    createdAt: subtractDays(currentDate, 15),
    startDate: subtractDays(currentDate, 14),
    status: 'active',
    gondolas: [
      {
        id: 'g3',
        serialNumber: 'GND-003-2023',
        status: 'under-inspection',
        location: {
          bay: 'Bay C',
          floor: '8',
          block: 'Block 3',
          elevation: 'East',
        },
        deployedAt: subtractDays(currentDate, 14),
        lastInspection: currentDate,
        nextInspection: addDays(currentDate, 14),
        documents: [
          {
            id: 'd6',
            type: 'DD',
            name: 'Deployment Document',
            uploadedAt: subtractDays(currentDate, 14),
            fileUrl: '/documents/dd-003.pdf',
            status: 'valid',
          },
          {
            id: 'd7',
            type: 'LEW',
            name: 'Licensed Electrical Worker Certificate',
            uploadedAt: subtractDays(currentDate, 14),
            expiryDate: subtractDays(currentDate, 5),
            fileUrl: '/documents/lew-003.pdf',
            status: 'expired',
          },
        ],
        photos: [
          {
            id: 'p3',
            url: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc',
            uploadedAt: subtractDays(currentDate, 14),
            description: 'Initial setup photo',
          }
        ],
      }
    ]
  },
  {
    id: 't3',
    doNumber: 'DO-2023-0003',
    clientName: 'Premier Properties',
    siteName: 'Changi Business Park',
    createdAt: subtractDays(currentDate, 60),
    startDate: subtractDays(currentDate, 58),
    endDate: subtractDays(currentDate, 2),
    status: 'completed',
    gondolas: [
      {
        id: 'g4',
        serialNumber: 'GND-004-2023',
        status: 'off-hired',
        location: {
          bay: 'Storage',
          floor: 'Ground',
          block: 'Warehouse',
          elevation: 'N/A',
        },
        deployedAt: subtractDays(currentDate, 58),
        lastInspection: subtractDays(currentDate, 15),
        documents: [
          {
            id: 'd8',
            type: 'DD',
            name: 'Deployment Document',
            uploadedAt: subtractDays(currentDate, 58),
            fileUrl: '/documents/dd-004.pdf',
            status: 'valid',
          },
          {
            id: 'd9',
            type: 'OFF_HIRE',
            name: 'Off-hire Form',
            uploadedAt: subtractDays(currentDate, 2),
            fileUrl: '/documents/offhire-004.pdf',
            status: 'valid',
          },
        ],
        photos: [
          {
            id: 'p4',
            url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
            uploadedAt: subtractDays(currentDate, 58),
            description: 'Deployment photo',
          },
          {
            id: 'p5',
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
            uploadedAt: subtractDays(currentDate, 2),
            description: 'Off-hire condition',
          },
        ],
      }
    ]
  }
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'warning',
    message: 'MOM Certificate for GND-001-2023 expires in 30 days',
    date: new Date(),
    read: false,
    actionLink: '/gondolas/g1',
  },
  {
    id: 'n2',
    type: 'error',
    message: 'LEW Certificate for GND-003-2023 has expired',
    date: subtractDays(new Date(), 1),
    read: false,
    actionLink: '/gondolas/g3',
  },
  {
    id: 'n3',
    type: 'info',
    message: 'Inspection scheduled for GND-002-2023 next week',
    date: subtractDays(new Date(), 2),
    read: true,
    actionLink: '/gondolas/g2',
  },
  {
    id: 'n4',
    type: 'success',
    message: 'Off-hire process completed for GND-004-2023',
    date: subtractDays(new Date(), 2),
    read: true,
    actionLink: '/gondolas/g4',
  },
];

// Mock certificate expirations
export const mockCertificateExpiries: CertificateExpiry[] = [
  {
    id: 'ce1',
    documentId: 'd3',
    gondolaId: 'g1',
    serialNumber: 'GND-001-2023',
    documentType: 'MOM_CERT',
    expiryDate: addDays(currentDate, 30),
    daysRemaining: 30,
    status: 'expiring',
  },
  {
    id: 'ce2',
    documentId: 'd5',
    gondolaId: 'g2',
    serialNumber: 'GND-002-2023',
    documentType: 'COS',
    expiryDate: addDays(currentDate, 60),
    daysRemaining: 60,
    status: 'valid',
  },
  {
    id: 'ce3',
    documentId: 'd7',
    gondolaId: 'g3',
    serialNumber: 'GND-003-2023',
    documentType: 'LEW',
    expiryDate: subtractDays(currentDate, 5),
    daysRemaining: -5,
    status: 'expired',
  },
];

// Stats for dashboard
export const dashboardStats = {
  activeGondolas: 3,
  expiringCertificates: 1,
  pendingInspections: 2,
  totalProjects: mockProjects.length,
};
