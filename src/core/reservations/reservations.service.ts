import { BadRequestException, Injectable } from '@nestjs/common';
import { CLSReservation } from './models/reservation.model';
import { calculatePricing } from '../rooms/functions/rooms.funtions';
import { ReservationGet } from './interfaces/reservations.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene la información de una reserva por su ID,
   * incluyendo el detalle de cobro calculado en tiempo de ejecución.
   *
   * @param {number} id - ID de la reserva
   * @returns {Promise<Reservation>} - Reserva con detalle de costos
   */
  async getReservationById(id: number): Promise<ReservationGet> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { room: true }, // Asegurar que incluya la info de la habitación
    });

    if (!reservation) {
      throw new BadRequestException(`No existe la reserva con id = ${id}`);
    }

    const pricing = calculatePricing(
      reservation.checkIn,
      reservation.checkOut,
      reservation.room.type,
      reservation.allInclusive,
      reservation.numGuests,
    );

    // Retorna la reserva con sus campos normales + detalle de costos.
    return {
      ...reservation,
      pricingDetails: pricing,
    };
  }

  /**
   * Obtiene todas las reservas agrupadas por pasadas, en curso y futuras.
   *
   * @returns {Promise<{ past: CLSReservation[], ongoing: CLSReservation[], future: CLSReservation[] }>} - Reservas agrupadas
   */
  async getAllReservations(): Promise<{
    past: CLSReservation[];
    ongoing: CLSReservation[];
    future: CLSReservation[];
  }> {
    const now = new Date();

    const reservations = await this.prisma.reservation.findMany({
      include: { room: true },
    });

    const past = reservations.filter(
      (reservation) => new Date(reservation.checkOut) < now,
    );
    const ongoing = reservations.filter(
      (reservation) =>
        new Date(reservation.checkIn) <= now &&
        new Date(reservation.checkOut) >= now,
    );
    const future = reservations.filter(
      (reservation) => new Date(reservation.checkIn) > now,
    );

    return { past, ongoing, future };
  }

  /**
   * Crea una nueva reserva.
   *
   * @param {CreateReservationDto} createReservationDto - Datos para crear la reserva
   * @returns {Promise<CLSReservation>} - Reserva creada
   */
  async createReservation(
    createReservationData: CreateReservationDto,
  ): Promise<CLSReservation> {
    const {
      checkIn,
      checkOut,
      numGuests,
      roomType,
      allInclusive,
      customerName,
    } = createReservationData;

    // Buscar habitaciones disponibles del tipo solicitado
    const availableRooms = await this.prisma.room.findMany({
      where: {
        type: roomType,
        capacity: { gte: numGuests },
        reservations: {
          none: {
            OR: [{ checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }],
          },
        },
      },
    });

    if (availableRooms.length === 0) {
      throw new BadRequestException(
        'No hay habitaciones disponibles del tipo solicitado en las fechas seleccionadas.',
      );
    }

    // Tomar la primera habitación disponible
    const room = availableRooms[0];

    // Crear la reserva
    const reservation = await this.prisma.reservation.create({
      data: {
        checkIn,
        checkOut,
        numGuests,
        roomId: room.id,
        allInclusive,
        customerName,
        totalPrice: calculatePricing(
          checkIn,
          checkOut,
          roomType,
          allInclusive,
          numGuests,
        ).finalPrice,
      },
      include: { room: true },
    });

    return reservation;
  }

  /**
   * Cancela una reserva por su ID.
   *
   * @param {number} id - ID de la reserva
   * @returns {Promise<CLSReservation>} - Reserva cancelada
   */
  async cancelReservation(id: number): Promise<CLSReservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new BadRequestException(`No existe la reserva con id = ${id}`);
    }

    return this.prisma.reservation.delete({
      where: { id },
      include: { room: true },
    });
  }
}
