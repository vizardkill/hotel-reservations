import { Reservation } from '@prisma/client';
import { PricingDetails } from '../../rooms/interfaces/room.interface';

export interface ReservationGet extends Reservation {
  pricingDetails: PricingDetails;
}
