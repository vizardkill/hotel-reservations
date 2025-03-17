import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ReservationsService } from './reservations.service';
import {
  CLSReservation,
  CLSReservationsGrouped,
  CLSReservationWithPricing,
} from './models/reservation.model';
import { ReservationGet } from './interfaces/reservations.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Resolver(() => CLSReservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Query(() => CLSReservationsGrouped, {
    name: 'getAllReservations',
    description: 'Get all reservations grouped by past, ongoing and future.',
  })
  async getAllReservations(): Promise<{
    past: CLSReservation[];
    ongoing: CLSReservation[];
    future: CLSReservation[];
  }> {
    return this.reservationsService.getAllReservations();
  }

  @Query(() => CLSReservationWithPricing, {
    name: 'getReservationById',
    description: 'Get a reservation by its ID.',
  })
  async getReservationById(@Args('id') id: number): Promise<ReservationGet> {
    return this.reservationsService.getReservationById(id);
  }

  @Mutation(() => CLSReservation, {
    name: 'createReservation',
    description: 'Crea una nueva reserva',
  })
  async createReservation(
    @Args('createReservationData') createReservationData: CreateReservationDto,
  ) {
    return this.reservationsService.createReservation(createReservationData);
  }

  @Mutation(() => CLSReservation, {
    name: 'cancelReservation',
    description: 'Cancela una reserva por su ID',
  })
  async cancelReservation(@Args('id') id: number): Promise<CLSReservation> {
    return this.reservationsService.cancelReservation(id);
  }
}
