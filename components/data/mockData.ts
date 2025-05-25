import { Notification } from "../data-types";

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