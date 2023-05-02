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