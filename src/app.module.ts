import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './core/rooms/rooms.module';
import { ReservationsModule } from './core/reservations/reservations.module';
import { PrismaModule } from './config/prisma.module';
import { PrismaService } from './config/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    RoomsModule,
    ReservationsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Genera el esquema automáticamente
      playground: true, // Habilita GraphQL Playground
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
