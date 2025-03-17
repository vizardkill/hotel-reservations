import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { RoomType } from '@prisma/client';
import { CreateRoomDto } from '../dto/create-room.dto';

export function ValidateRoomCapacity(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidateRoomCapacity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(capacityValue: number, args: ValidationArguments) {
          const dto = args.object as CreateRoomDto;
          if (capacityValue < 1) return false;

          switch (dto.type) {
            case RoomType.SENCILLA:
              return capacityValue <= 1;
            case RoomType.DOBLE:
              return capacityValue <= 2;
            case RoomType.PRESIDENCIAL:
              return capacityValue <= 4;
            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const dto = args.object as CreateRoomDto;
          switch (dto.type) {
            case RoomType.SENCILLA:
              return 'Capacidad máxima para una habitación Sencilla es 1.';
            case RoomType.DOBLE:
              return 'Capacidad máxima para una habitación Doble es 2.';
            case RoomType.PRESIDENCIAL:
              return 'Capacidad máxima para una habitación Presidencial es 4.';
            default:
              return 'Capacidad inválida para esta habitación.';
          }
        },
      },
    });
  };
}
