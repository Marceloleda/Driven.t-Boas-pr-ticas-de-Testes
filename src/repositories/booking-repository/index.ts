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
  

const bookingRepository = {
    findBooking,
};

export default bookingRepository;