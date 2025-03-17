import { Injectable } from '@nestjs/common';
import { AvailableRoomsArgs } from './dto/available-rooms.args';
import { Room, RoomType } from '@prisma/client';
import { calculatePricing } from './functions/rooms.funtions';
import { RoomGetAvailableRooms } from './interfaces/room.interface';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async getTypeRoom(roomType: RoomType): Promise<Room[]> {
    return this.prisma.room.findMany({
      where: {
        type: roomType,
      },
    });
  }

  async getAvailableRooms(
    args: AvailableRoomsArgs,
  ): Promise<RoomGetAvailableRooms[]> {
    const {
      checkInDate,
      checkOutDate,
      guests,
      roomType,
      onlyExteriorView,
      allInclusive,
    } = args;

    // Filtrar habitaciones que ya están reservadas en las fechas dadas
    const reservedRoomIds = await this.prisma.reservation.findMany({
      where: {
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
      select: { roomId: true },
    });

    const unavailableRoomIds = reservedRoomIds.map((r) => r.roomId);

    // Filtrar habitaciones disponibles según los criterios
    const rooms = await this.prisma.room.findMany({
      where: {
        id: { notIn: unavailableRoomIds },
        capacity: { gte: guests },
        type: roomType ? { equals: roomType as RoomType } : undefined,
        view: onlyExteriorView ? { equals: 'EXTERIOR' } : undefined,
      },
    });

    // Calcular detalles de cobro para cada habitación disponible
    const data: RoomGetAvailableRooms[] = rooms.map((room) => {
      const pricingDetails = calculatePricing(
        checkInDate,
        checkOutDate,
        room.type,
        allInclusive ?? false,
        guests,
      );
      return { ...room, pricingDetails };
    });

    return data;
  }
}
