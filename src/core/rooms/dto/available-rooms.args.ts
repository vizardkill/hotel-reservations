import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { RoomType } from '@prisma/client';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

registerEnumType(RoomType, {
  name: 'RoomType',
});

@ArgsType()
export class AvailableRoomsArgs {
  @Field(() => GraphQLISODateTime)
  @IsDateString()
  @IsNotEmpty()
  checkInDate: Date;

  @Field(() => GraphQLISODateTime)
  @IsDateString()
  @IsNotEmpty()
  checkOutDate: Date;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  guests: number;

  @Field({ nullable: true })
  @IsOptional()
  roomType?: RoomType;

  @Field({ nullable: true })
  @IsOptional()
  onlyExteriorView?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  allInclusive?: boolean;
}
