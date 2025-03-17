import { Room } from '@prisma/client';

export class PricingDetails {
  totalDays: number;
  weekDays: number;
  weekendDays: number;
  basePrice: number;
  weekendPriceIncrease: number;
  totalDiscount: number;
  allInclusiveCost: number;
  finalPrice: number;
}

export interface RoomGetAvailableRooms extends Room {
  pricingDetails: PricingDetails;
}
