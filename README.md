# Proyecto de Reservaciones de Hotel

Este proyecto es una API GraphQL para gestionar reservaciones de hotel, utilizando NestJS, Apollo Server y Prisma.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto:

1. Clona el repositorio:
```bash
git clone https://github.com/vizardkill/hotel-reservations.git
cd hotel-reservations
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos Prisma
```bash
npx prisma migrate dev --name init
```

4. Inicia el servidor
```bash
npm run start:dev
```

5. Abre el Apollo Playground en http://localhost:3000/graphql para probar las queries y mutaciones.

## Queries y Mutaciones Disponibles

### Obtener tipos de habitaciones

```GraphQL
query {
        getTypeRoom(roomType: "SENCILLA") {
          id
          type
          capacity
        }
      }
```

### Obtener habitaciones disponibles

```GraphQL
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
```

### Obtener Todas las Reservas

```GraphQL
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
```

### Obtener Información de una Reserva

```GraphQL
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
```

### Crear una reserva

```GraphQL
mutation {
  createReservation(createReservationData: {
    checkIn: "2025-03-17T00:00:00.000Z"
    checkOut: "2025-03-20T00:00:00.000Z"
    numGuests: 2
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
```

### Cancelar una Reserva

```GraphQL
mutation {
  cancelReservation(id: 1) {
    id
    customerName
    checkIn
    checkOut
  }
}
```

## Pruebas

Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```
Esto ejecutará las pruebas configuradas para el proyecto, asegurando que todas las funcionalidades estén funcionando correctamente.