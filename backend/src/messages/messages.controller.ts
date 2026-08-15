import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':bookingId')
  getMessages(@Param('bookingId') bookingId: string, @Request() req: any) {
    return this.messagesService.getMessagesByBooking(bookingId, req.user.id);
  }
}
