import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RoomType, ViewType } from '@prisma/client';
import {
  RoomGetAvailableRooms,
  PricingDetails,
} from '../interfaces/room.interface';

// Registra el enum ViewType en GraphQL
registerEnumType(ViewType, {
  name: 'ViewType',
  description: 'Tipo de vista de la habitación (EXTERIOR, INTERIOR)',
});

// Registra el enum RoomType en GraphQL
registerEnumType(RoomType, {
  name: 'RoomType',
  description: 'Tipo de habitación (SENCILLA, DOBLE, PRESIDENCIAL)',
});

/**
 * Modelo de precios para una habitación.
 */
@ObjectType()
export class CLSPricingDetails implements PricingDetails {
  @Field(() => Int, { description: 'Número total de días de la reserva.' })
  totalDays: number;

  @Field(() => Int, {
    description: 'Número de días entre semana de la reserva.',
  })
  weekDays: number;

  @Field(() => Int, {
    description: 'Número de días de fin de semana de la reserva.',
  })
  weekendDays: number;
  
  @Field(() => Int, { description: 'Precio base de la reserva.' })
  basePrice: number;

  @Field(() => Int, { description: 'Incremento de precio por fin de semana.' })
  weekendPriceIncrease: number;

  @Field(() => Int, { description: 'Descuento total aplicado a la reserva.' })
  totalDiscount: number;

  @Field(() => Int, { description: 'Costo total todo incluido.' })
  allInclusiveCost: number;

  @Field(() => Int, {
    description: 'Precio final después de impuestos y descuentos.',
  })
  finalPrice: number;
}

/**
 * Modelo básico de una habitación.
 */
@ObjectType()
export class CLSRoom {
  @Field(() => Int, { description: 'ID único de la habitación.' })
  id: number;

  @Field(() => RoomType, {
    description: 'Tipo de habitación (Sencilla, Doble, Presidencial).',
  })
  type: RoomType;

  @Field(() => Int, { description: 'Capacidad máxima de huéspedes.' })
  capacity: number;

  @Field(() => ViewType, { description: 'Vista al exterior o interior.' })
  view: ViewType;

  @Field(() => Int, {
    description: 'Precio base por noche para esta habitación.',
  })
  pricePerNight: number;
}

/**
 * Modelo que extiende la información de las habitaciones
 * para el caso de consulta de habitaciones disponibles,
 * incluyendo detalles de pricing adicionales.
 */
@ObjectType()
export class CLSRoomGetAvailableRooms implements RoomGetAvailableRooms {
  @Field(() => Int, { description: 'ID único de la habitación.' })
  id: number;

  @Field(() => RoomType, {
    description: 'Tipo de habitación (Sencilla, Doble, Presidencial).',
  })
  type: RoomType;

  @Field(() => Int, { description: 'Capacidad máxima de huéspedes.' })
  capacity: number;

  @Field(() => ViewType, {
    description: 'Vista al exterior o interior.',
  })
  view: ViewType;

  @Field(() => Int, {
    description: 'Precio base por noche para esta habitación.',
  })
  pricePerNight: number;

  @Field(() => CLSPricingDetails, {
    description: 'Detalles de costos asociados a la reserva.',
  })
  pricingDetails: PricingDetails;
}
