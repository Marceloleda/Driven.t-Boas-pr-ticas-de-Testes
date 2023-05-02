import { Router } from 'express';
import { getBooking} from '@/controllers';

const bookingRouter = Router();

bookingRouter.get('/', getBooking);

export { bookingRouter };
