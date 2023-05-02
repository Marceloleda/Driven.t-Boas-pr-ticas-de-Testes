import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

async function getAllBooking(userId: number) {
  
    const booking = await bookingRepository.findBooking(userId);
    if (!booking ) {
      throw notFoundError();
    }
    return booking;
}
async function postRoomBooking(res: Response, roomId: number, userId: number) {
    const userTicket = await ticketsRepository.findUserTickets(userId);
    const hasValidTicket = userTicket.some(ticket =>
        ticket.ticketTypeId === 1 && ticket.status === 'PAID' 
    );
      
    if (!hasValidTicket) {
        return res.status(httpStatus.FORBIDDEN)
    }
    const room = await bookingRepository.findRoomId(roomId);
    console.log(room)
    console.log('room')
    if (!room || room === null) {
        throw notFoundError()
    }
    console.log('capacity')

    if (room.capacity <= 0) { 
        return res.status(httpStatus.FORBIDDEN).send({ error: 'Sala sem vagas disponíveis' })
    }
  
    const roomBooking = await bookingRepository.insertRoomBooking(roomId, userId)
    return roomBooking;
}
  

export default {
    getAllBooking,
    postRoomBooking
};