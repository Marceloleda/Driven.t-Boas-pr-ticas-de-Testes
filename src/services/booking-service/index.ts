import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Booking, TicketStatus } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";


async function getAllBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function postRoomBooking(res: Response, roomId: number, userId: number): Promise<any> {
  const userTickets = await ticketsRepository.findUserTickets(userId);

  const hasValidTicket = userTickets.some(
    (ticket) => ticket.ticketTypeId === 1 && ticket.status === TicketStatus.PAID
  );

  if (!hasValidTicket) {
    return res.status(httpStatus.FORBIDDEN).send({ error: "Invalid ticket" });
  }

  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.capacity <= 0) {
    return res
      .status(httpStatus.FORBIDDEN)
  }

  const roomBooking = await bookingRepository.insertRoomBooking(roomId, userId);

  return roomBooking;
}

async function updateBookingRoom(res: Response, bookingId: number, roomId: number): Promise<Booking> {
    const booking = await bookingRepository.findBookingById(bookingId);
    if (!booking) {
      throw notFoundError();
    }
  
    const room = await bookingRepository.findRoomById(roomId);
    if (!room) {
      throw notFoundError();
    }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    
    const isRoomAvailable = await bookingRepository.isRoomAvailable(roomId, startDate, endDate);
    if (!isRoomAvailable) {
      throw httpStatus.FORBIDDEN;
    }
  
    return await bookingRepository.updateBookingRoom(bookingId, roomId);
}
  

export default {
  getAllBooking,
  postRoomBooking,
  updateBookingRoom
};
