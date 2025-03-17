import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../config/prisma.service';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';

describe('Tests - RoomsResolver (GraphQL)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, RoomsService, RoomsResolver],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Tipos de Habitación', () => {
    const query = `#graphql
      query {
        getTypeRoom(roomType: "SENCILLA") {
          id
          type
          capacity
        }
      }
    `;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getTypeRoom[0].type).toBe('SENCILLA');
      });
  });

  it('2. Obtener habitaciones disponibles', () => {
    const query = `#graphql
      query {
        getAvailableRooms(
          checkInDate: "2025-03-17"
          checkOutDate: "2025-03-20"
          guests: 2
          roomType: "DOBLE"
          onlyExteriorView: false
          allInclusive: false
        ) {
          id
          type
          capacity
          view
          pricePerNight
          pricingDetails {
            finalPrice
            basePrice
            totalDays
          }
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((res) => {
        // Verifica si la respuesta incluye un array
        expect(Array.isArray(res.body.data.getAvailableRooms)).toBe(true);
        // Ejemplo: Revisar que la primera habitación tenga type = 'DOBLE'
        if (res.body.data.getAvailableRooms.length > 0) {
          expect(res.body.data.getAvailableRooms[0].type).toBe('DOBLE');
        }
      });
  });
});
