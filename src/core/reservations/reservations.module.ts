import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsResolver } from './reservations.resolver';
import { PrismaModule } from '../../config/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReservationsService, ReservationsResolver],
})
export class ReservationsModule {}
