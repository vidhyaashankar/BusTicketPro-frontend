export interface Ticket {
  id: number;
  passengerName: string;
  route: string;
  seatNumber: string;
  departureTime: string;
  fare: number;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface Stats {
  totalRevenue: number;
  totalTickets: number;
  activeTickets: number;
  cancelledTickets: number;
  completedTickets: number;
}

export interface BookingData {
  passengerName: string;
  route: string;
  seatNumber: string;
  departureTime: string;
  fare: number;
}
