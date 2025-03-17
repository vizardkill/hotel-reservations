import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateRoomDto } from './create-room.dto';

@InputType()
export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @Field(() => Int, { nullable: true })
  id?: number;
}