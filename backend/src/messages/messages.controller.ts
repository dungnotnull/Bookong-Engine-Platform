import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMessage(@Body() body: { bookingId: string; content: string }, @Request() req: any) {
    return this.messagesService.saveMessage(body.bookingId, req.user.id, body.content);
  }
}
