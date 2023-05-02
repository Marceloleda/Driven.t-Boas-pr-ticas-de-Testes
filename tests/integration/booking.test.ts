import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { cleanDb } from '../helpers';

import {

  createUser,
} from '../factories';
import app, { init } from '@/app';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { getBooking, postBooking } from '@/controllers';
import { Response } from 'express';
import bookingRepository from '@/repositories/booking-repository';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /Booking", () => {

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
        
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return all bookings for a given user", async () => {
        const userId = faker.datatype.number();
        const mockBooking = { id: faker.datatype.number(), room: { id: faker.datatype.number(), name: faker.lorem.words() } };
        bookingService.getAllBooking = jest.fn().mockResolvedValue(mockBooking);
    
        const req = { userId } as any;
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
    
        await getBooking(req, res);
    
        expect(bookingService.getAllBooking).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
        expect(res.send).toHaveBeenCalledWith(mockBooking);
      });
    
      it("should return a 404 if no bookings were found", async () => {
        const userId = faker.datatype.number();
        bookingService.getAllBooking = jest.fn().mockRejectedValue(new Error("Booking not found"));
    
        const req = { userId } as any;
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
    
        await getBooking(req, res);
    
        expect(bookingService.getAllBooking).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
        expect(res.send).toHaveBeenCalledWith({});
      });
});

describe('POST /booking', () => {
    let mockRequest: AuthenticatedRequest;
    let mockResponse: Partial<Response>;
  
    beforeEach(() => {
      mockRequest = {
        userId: faker.datatype.number(),
        body: {
          roomId: faker.datatype.number(),
        },
      } as AuthenticatedRequest;
  
     
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should return 200 and the id of the booking when the request is successful', async () => {
      const bookingId = faker.datatype.number();
      const mockBooking = { id: bookingId };
  
      (bookingService as jest.Mocked<typeof bookingService>).postRoomBooking.mockResolvedValueOnce(
        mockBooking
      );
  
      await postBooking(mockRequest, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockBooking.id);
    });
  
    it('should return 403 when the user does not have a valid ticket', async () => {
      (bookingService as jest.Mocked<typeof bookingService>).postRoomBooking.mockResolvedValueOnce(
        undefined
      );
  
      await postBooking(mockRequest, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.FORBIDDEN);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Invalid ticket' });
    });
  
    it('should return 403 when the room is at full capacity', async () => {
      (bookingService as jest.Mocked<typeof bookingService>).postRoomBooking.mockRejectedValueOnce({
        statusCode: httpStatus.FORBIDDEN,
      });
  
      await postBooking(mockRequest, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.FORBIDDEN);
      expect(mockResponse.send).toHaveBeenCalledWith({});
    });
  
    it('should return 500 when an unexpected error occurs', async () => {
      const error = new Error('Unexpected error');
  
      (bookingService as jest.Mocked<typeof bookingService>).postRoomBooking.mockRejectedValueOnce(
        error
      );
  
      await postBooking(mockRequest, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalledWith({});
    });
});

describe('updateBookingRoom', () => {
    test('should update booking room successfully', async () => {
      const insertedBooking = await bookingRepository.insertRoomBooking(1, 1);
  
      const roomId = faker.random.numeric();
  
      const updatedBooking = await bookingRepository.updateBookingRoom(insertedBooking.id, roomId);
  
      expect(updatedBooking.roomId).toEqual(roomId);
    });
  

    test('should throw an error if room is not available', async () => {
      const insertedBooking = await bookingRepository.insertRoomBooking(1, 1);
  
      const secondBooking = await bookingRepository.insertRoomBooking(1, 1);
  
      const updatePromise = bookingRepository.updateBookingRoom(insertedBooking.id, secondBooking.roomId);
  
      await expect(updatePromise).rejects.toThrow('Room is not available');
    });
  });