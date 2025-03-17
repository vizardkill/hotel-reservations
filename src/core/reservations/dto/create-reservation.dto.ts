import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { RoomType } from '@prisma/client';
import {
  IsInt,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  IsString,
} from 'class-validator';

// Registra el enum RoomType en GraphQL
registerEnumType(RoomType, {
  name: 'RoomType',
  description: 'Tipo de habitación (SENCILLA, DOBLE, PRESIDENCIAL)',
});

@InputType()
export class CreateReservationDto {
  @Field(() => String)
  @IsDateString()
  @IsNotEmpty()
  checkIn: Date;

  @Field(() => String)
  @IsDateString()
  @IsNotEmpty()
  checkOut: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  numGuests: number;

  @Field(() => RoomType)
  @IsEnum(RoomType)
  @IsNotEmpty()
  roomType: RoomType;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  allInclusive: boolean;
}
