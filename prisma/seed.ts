import { PrismaClient, RoomType, ViewType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingRooms = await prisma.room.findMany();
  if (existingRooms.length === 0) {
    // Inserta 10 Sencillas, 15 Dobles, 5 Presidenciales
    const roomsToCreate = [
      ...Array(10).fill({
        type: RoomType.SENCILLA,
        capacity: 1,
        view: ViewType.INTERIOR,
        pricePerNight: 60000,
      }),
      ...Array(15).fill({
        type: RoomType.DOBLE,
        capacity: 2,
        view: ViewType.EXTERIOR,
        pricePerNight: 100000,
      }),
      ...Array(5).fill({
        type: RoomType.PRESIDENCIAL,
        capacity: 4,
        view: ViewType.EXTERIOR,
        pricePerNight: 160000,
      }),
    ];

    await prisma.room.createMany({ data: roomsToCreate });
  }

  const rooms = await prisma.room.findMany();

  const existingReservations = await prisma.reservation.findMany();
  if (existingReservations.length === 0) {
    // Inserta algunas reservas de ejemplo
    const reservationsToCreate = [
      {
        checkIn: new Date('2025-03-17T00:00:00.000Z'),
        checkOut: new Date('2025-03-20T00:00:00.000Z'),
        numGuests: 1,
        roomId: rooms.find((room) => room.type === RoomType.SENCILLA)?.id,
        allInclusive: false,
        customerName: 'John Doe',
        totalPrice: 180000,
      },
      {
        checkIn: new Date('2025-03-21T00:00:00.000Z'),
        checkOut: new Date('2025-03-25T00:00:00.000Z'),
        numGuests: 2,
        roomId: rooms.find((room) => room.type === RoomType.DOBLE)?.id,
        allInclusive: true,
        customerName: 'Jane Smith',
        totalPrice: 400000,
      },
      {
        checkIn: new Date('2025-04-01T00:00:00.000Z'),
        checkOut: new Date('2025-04-05T00:00:00.000Z'),
        numGuests: 3,
        roomId: rooms.find((room) => room.type === RoomType.PRESIDENCIAL)?.id,
        allInclusive: true,
        customerName: 'Alice Johnson',
        totalPrice: 640000,
      },
      {
        checkIn: new Date('2025-04-10T00:00:00.000Z'),
        checkOut: new Date('2025-04-15T00:00:00.000Z'),
        numGuests: 1,
        roomId: rooms.find((room) => room.type === RoomType.SENCILLA)?.id,
        allInclusive: false,
        customerName: 'Bob Brown',
        totalPrice: 300000,
      },
      {
        checkIn: new Date('2025-04-20T00:00:00.000Z'),
        checkOut: new Date('2025-04-25T00:00:00.000Z'),
        numGuests: 2,
        roomId: rooms.find((room) => room.type === RoomType.DOBLE)?.id,
        allInclusive: true,
        customerName: 'Charlie Davis',
        totalPrice: 500000,
      },
      {
        checkIn: new Date('2025-05-01T00:00:00.000Z'),
        checkOut: new Date('2025-05-05T00:00:00.000Z'),
        numGuests: 4,
        roomId: rooms.find((room) => room.type === RoomType.PRESIDENCIAL)?.id,
        allInclusive: true,
        customerName: 'Diana Evans',
        totalPrice: 640000,
      },
      {
        checkIn: new Date('2025-05-10T00:00:00.000Z'),
        checkOut: new Date('2025-05-15T00:00:00.000Z'),
        numGuests: 1,
        roomId: rooms.find((room) => room.type === RoomType.SENCILLA)?.id,
        allInclusive: false,
        customerName: 'Eve Foster',
        totalPrice: 300000,
      },
      {
        checkIn: new Date('2025-05-20T00:00:00.000Z'),
        checkOut: new Date('2025-05-25T00:00:00.000Z'),
        numGuests: 2,
        roomId: rooms.find((room) => room.type === RoomType.DOBLE)?.id,
        allInclusive: true,
        customerName: 'Frank Green',
        totalPrice: 500000,
      },
      {
        checkIn: new Date('2025-06-01T00:00:00.000Z'),
        checkOut: new Date('2025-06-05T00:00:00.000Z'),
        numGuests: 3,
        roomId: rooms.find((room) => room.type === RoomType.PRESIDENCIAL)?.id,
        allInclusive: true,
        customerName: 'Grace Harris',
        totalPrice: 640000,
      },
      {
        checkIn: new Date('2025-06-10T00:00:00.000Z'),
        checkOut: new Date('2025-06-15T00:00:00.000Z'),
        numGuests: 1,
        roomId: rooms.find((room) => room.type === RoomType.SENCILLA)?.id,
        allInclusive: false,
        customerName: 'Henry Irving',
        totalPrice: 300000,
      },
    ];

    await prisma.reservation.createMany({
      data: reservationsToCreate.filter(
        (
          reservation,
        ): reservation is Omit<typeof reservation, 'roomId'> & {
          roomId: number;
        } => reservation.roomId !== undefined,
      ),
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
