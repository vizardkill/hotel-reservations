import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CLSPricingDetails, CLSRoom } from '../../rooms/models/room.model';
import { PricingDetails } from '../../rooms/interfaces/room.interface';

/**
 * Modelo básico de una reserva en GraphQL.
 */
@ObjectType()
export class CLSReservation {
  @Field(() => Int, { description: 'ID único de la reserva.' })
  id: number;

  @Field(() => CLSRoom, {
    description: 'Información de la habitación reservada.',
  })
  room: CLSRoom;

  @Field(() => Int, { description: 'ID de la habitación reservada.' })
  roomId: number;

  @Field(() => String, {
    description: 'Nombre del cliente que realizó la reserva.',
  })
  customerName: string;

  @Field(() => Int, { description: 'Número de huéspedes.' })
  numGuests: number;

  @Field(() => String, { description: 'Fecha de check-in.' })
  checkIn: Date;

  @Field(() => String, { description: 'Fecha de check-out.' })
  checkOut: Date;

  @Field(() => Boolean, {
    description: 'Indica si la reserva incluye el plan todo incluido.',
  })
  allInclusive: boolean;
}

/**
 * Modelo que extiende la información de una reserva
 * para incluir detalles de costos asociados a la reserva.
 */
@ObjectType()
export class CLSReservationWithPricing extends CLSReservation {
  @Field(() => CLSPricingDetails, {
    description: 'Detalles de costos asociados a la reserva.',
  })
  pricingDetails: PricingDetails;
}

/**
 * Modelo que agrupa las reservas en pasadas, en curso y futuras.
 */
@ObjectType()
export class CLSReservationsGrouped {
  @Field(() => [CLSReservation], { description: 'Reservas pasadas.' })
  past: CLSReservation[];

  @Field(() => [CLSReservation], { description: 'Reservas en curso.' })
  ongoing: CLSReservation[];

  @Field(() => [CLSReservation], { description: 'Reservas futuras.' })
  future: CLSReservation[];
}
