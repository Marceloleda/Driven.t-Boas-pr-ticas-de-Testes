import { prisma } from '@/config';

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
  
async function findRoomById(roomId:number) {
    const room = await prisma.room.findFirst({
        where: {id: roomId}
    })
    return room;
}

const bookingRepository = {
    findBooking,
    insertRoomBooking,
    findRoomById
};

export default bookingRepository;