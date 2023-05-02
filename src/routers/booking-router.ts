import { Router } from 'express';
import { changeBooking, getBooking, postBooking} from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('', getBooking).post('', postBooking).put('/:bookingId', changeBooking);

export { bookingRouter };
