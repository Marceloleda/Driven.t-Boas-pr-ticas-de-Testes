import { Router } from 'express';
import { getBooking, postBooking, updateBookingRoom} from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBooking).post('/', postBooking).put('/:bookingId', updateBookingRoom);

export { bookingRouter };
