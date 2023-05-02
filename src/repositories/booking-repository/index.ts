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
async function insertRoomBooking(roomId: number, userId: number) {
    const insertBooking = await prisma.booking.create({
        data: {
          userId: userId,
          roomId: roomId,
          updatedAt: new Date()
        }
    });
    return insertBooking;
}
  
async function findRoomId(roomId:number) {
    const room = await prisma.room.findFirst({
        where: {id: roomId}
    })
    return room;
}

const bookingRepository = {
    findBooking,
    insertRoomBooking,
    findRoomId
};

export default bookingRepository;