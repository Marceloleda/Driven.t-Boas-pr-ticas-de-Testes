import { Router } from 'express';
import { getBooking, postBooking, updateBookingRoom} from '@/controllers';

const bookingRouter = Router();

bookingRouter.get('/', getBooking).post('/', postBooking).put('/:bookingId', updateBookingRoom);

export { bookingRouter };
