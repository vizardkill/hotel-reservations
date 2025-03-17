import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../config/prisma.service';
import { ReservationsService } from './reservations.service';
import { ReservationsResolver } from './reservations.resolver';

describe('Tests - ReservationsResolver (GraphQL)', () => {
  let app: INestApplication;
  let createdReservationId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, ReservationsService, ReservationsResolver],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Obtener TODAS las reservas', () => {
    const query = `#graphql
      query {
        getAllReservations {
          past {
            id
            customerName
            checkIn
            checkOut
          }
          ongoing {
            id
            customerName
            checkIn
            checkOut
          }
          future {
            id
            customerName
            checkIn
            checkOut
          }
        }
      }
    `;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getAllReservations).toHaveProperty('past');
        expect(res.body.data.getAllReservations).toHaveProperty('ongoing');
        expect(res.body.data.getAllReservations).toHaveProperty('future');
      });
  });

  it('2. Obtener la información de una reserva', () => {
    const query = `#graphql
      query {
        getReservationById(id: 1) {
          id
          customerName
          checkIn
          checkOut
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
        expect(res.body.data.getReservationById).toHaveProperty('id');
        expect(res.body.data.getReservationById).toHaveProperty(
          'pricingDetails',
        );
      });
  });

  it('3. Crear una reserva.', () => {
    const mutation = `#graphql
      mutation {
        createReservation(createReservationData: {
          checkIn: "2025-03-17T00:00:00.000Z"
          checkOut: "2025-03-20T00:00:00.000Z"
          numGuests: 2,
          customerName: "Santiago Cardona"
          roomType: DOBLE
          allInclusive: false
        }) {
          id
          customerName
          checkIn
          checkOut
        }
      }
    `;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createReservation).toHaveProperty('id');
        expect(res.body.data.createReservation).toHaveProperty('checkIn');
        expect(res.body.data.createReservation).toHaveProperty('checkOut');
        createdReservationId = res.body.data.createReservation.id;
      });
  });

  it('4. Cancelar reserva.', () => {
    const mutation = `#graphql
      mutation {
        cancelReservation(id: ${createdReservationId}) {
          id
          customerName
          checkIn
          checkOut
        }
      }
    `;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.cancelReservation).toHaveProperty('id');
        expect(res.body.data.cancelReservation).toHaveProperty('checkIn');
        expect(res.body.data.cancelReservation).toHaveProperty('checkOut');
      });
  });
});
