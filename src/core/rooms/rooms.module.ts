import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';
import { PrismaModule } from '../../config/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoomsService, RoomsResolver]
})
export class RoomsModule {}
