-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SENCILLA', 'DOBLE', 'PRESIDENCIAL');

-- CreateEnum
CREATE TYPE "ViewType" AS ENUM ('EXTERIOR', 'INTERIOR');

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "type" "RoomType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "view" "ViewType" NOT NULL,
    "price_per_night" INTEGER NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "num_guests" INTEGER NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "total_price" INTEGER NOT NULL,
    "all_inclusive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
