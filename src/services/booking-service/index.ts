import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function getAllBooking(userId: number) {
  
    const booking = await bookingRepository.findBooking(userId);
    if (!booking ) {
      throw notFoundError();
    }
    return booking;
}

export default {
    getAllBooking,
};