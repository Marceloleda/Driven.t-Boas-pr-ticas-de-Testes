import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const userId: number  = req.userId;

    try{
        const booking = await bookingService.getAllBooking(userId);
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
      const booking = await bookingService.postRoomBooking(res, roomId, userId); 

      res.status(httpStatus.OK).send(booking.id);
    } catch (error) {
      return res.status(httpStatus.FORBIDDEN).send({});
    }
}

export async function updateBookingRoom(req: Request, res: Response) {
    const { bookingId } = req.params;
    const { roomId } = req.body;
  
    const updatedBooking = await bookingService.updateBookingRoom(res, Number(bookingId), Number(roomId));
  
    return res.status(200).send(updatedBooking);
}
  
  
