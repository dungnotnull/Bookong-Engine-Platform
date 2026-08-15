import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookingStatus } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, hotelId: string, createReviewDto: CreateReviewDto) {
    const { bookingId, locationRating, cleanlinessRating, serviceRating, valueRating, comment } = createReviewDto;

    // Check if booking belongs to user and hotel, and is CHECKED_OUT
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
        room: {
          hotelId: hotelId,
        },
        status: BookingStatus.CHECKED_OUT,
      },
    });

    if (!booking) {
      throw new BadRequestException('You can only review a hotel after checking out of your booking.');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this booking.');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        bookingId,
        userId,
        hotelId,
        locationRating,
        cleanlinessRating,
        serviceRating,
        valueRating,
        comment,
      },
    });

    // Update hotel average rating
    await this.updateHotelStarRating(hotelId);

    return review;
  }

  async findAllByHotel(hotelId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { hotelId },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { hotelId } }),
    ]);

    return {
      reviews,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({ where: { id } });

    // Update hotel rating after deletion
    await this.updateHotelStarRating(review.hotelId);

    return { message: 'Review deleted successfully' };
  }

  private async updateHotelStarRating(hotelId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { hotelId },
      _avg: {
        locationRating: true,
        cleanlinessRating: true,
        serviceRating: true,
        valueRating: true,
      },
    });

    const avgRatings = aggregate._avg;
    let newStarRating = 0;

    if (avgRatings.locationRating !== null) {
      newStarRating =
        ((avgRatings.locationRating || 0) +
          (avgRatings.cleanlinessRating || 0) +
          (avgRatings.serviceRating || 0) +
          (avgRatings.valueRating || 0)) /
        4;
    }

    await this.prisma.hotel.update({
      where: { id: hotelId },
      data: { starRating: newStarRating },
    });
  }
}
