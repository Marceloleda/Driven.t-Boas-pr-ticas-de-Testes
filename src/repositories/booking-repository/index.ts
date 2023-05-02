import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import { Booking, Room } from '@prisma/client';

async function findBooking(userId: number) {
    const booking = await prisma.booking.findFirst({
      where: { userId: userId },
      include: { Room: true }
    });
  
    return {
      id: booking.id,
      Room: booking.Room
    };
}
async function insertRoomBooking(roomId: number, userId: number): Promise<any> {
    const insertBooking = await prisma.booking.create({
        data: {
          userId: userId,
          roomId: roomId,
          updatedAt: new Date()
        }
    });
    return insertBooking;
}

async function findBookingById(bookingId: number): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
}
  
async function findRoomById(roomId: number): Promise<Room | null> {
    return await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
}
  
async function updateBookingRoom(bookingId: number, roomId: number): Promise<Booking> {
    return await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        roomId: roomId,
      },
    });
}

async function isRoomAvailable(roomId: number, startDate: Date, endDate: Date) {
    const reservationsCount = await prisma.booking.count({
      where: {
        roomId,
        createdAt: {
          lte: endDate,
        },
        updatedAt: {
          gte: startDate,
        },
      },
    })
  
    return reservationsCount === 0
  }
  
  
const bookingRepository = {
    findBooking,
    insertRoomBooking,
    findRoomById,
    findBookingById,
    updateBookingRoom,
    isRoomAvailable
};

export default bookingRepository;