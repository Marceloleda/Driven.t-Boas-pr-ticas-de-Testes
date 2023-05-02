import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const userId: number  = req.userId;

    try{
        const booking = await bookingService.getBooking(userId);
        res.status(httpStatus.OK).send(booking)
    }
    catch(error){
        return res.status(httpStatus.NOT_FOUND).send({});

    }
}
export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const userId: number = req.userId;
    const roomId: number = req.body.roomId; 
  
    try {
      const booking = await bookingService.bookingRoomById( roomId, userId); 

      res.status(httpStatus.OK).send(booking.id);
    } catch (error) {
      return res.status(httpStatus.FORBIDDEN).send({});
    }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const bookingId = Number(req.params.bookingId);
    if (!bookingId) return res.sendStatus(httpStatus.BAD_REQUEST);
  
    try {
      const { roomId } = req.body as Record<string, number>; // <tipo da chave, tipo do valor>
      const booking = await bookingService.changeBookingRoomById(userId, roomId);
  
      return res.status(httpStatus.OK).send({
        bookingId: booking.id,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
