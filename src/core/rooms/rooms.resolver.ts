import { Resolver, Query, Args } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { CLSRoom, CLSRoomGetAvailableRooms } from './models/room.model';
import { AvailableRoomsArgs } from './dto/available-rooms.args';
import { RoomType } from '@prisma/client';

@Resolver(() => CLSRoom)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Query(() => [CLSRoom], {
    name: 'getTypeRoom',
    description: 'Get all rooms of a specific type',
  })
  async getTypeRoom(@Args('roomType') roomType: RoomType) {
    return this.roomsService.getTypeRoom(roomType);
  }

  @Query(() => [CLSRoomGetAvailableRooms], {
    name: 'getAvailableRooms',
    description: 'Get all available rooms for the given criteria',
  })
  async getAvailableRooms(@Args() args: AvailableRoomsArgs) {
    return this.roomsService.getAvailableRooms(args);
  }
}
