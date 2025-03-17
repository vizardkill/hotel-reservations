import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { RoomType, ViewType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ValidateRoomCapacity } from '../decorators/validate-room-type.decorator';

registerEnumType(RoomType, {
  name: 'RoomType',
});

registerEnumType(ViewType, {
  name: 'ViewType',
});

@InputType()
export class CreateRoomDto {
  @Field(() => RoomType)
  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  @ValidateRoomCapacity()
  capacity: number;

  @Field(() => ViewType)
  @IsEnum(ViewType)
  @IsNotEmpty()
  view: ViewType;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  pricePerNight: number;
}
