import { Router } from 'express';
import { getBooking, postBooking} from '@/controllers';

const bookingRouter = Router();

bookingRouter.get('/', getBooking).post('/', postBooking);

export { bookingRouter };
