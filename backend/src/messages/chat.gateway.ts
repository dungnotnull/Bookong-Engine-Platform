import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`[ChatGateway] Client trying to connect: ${client.id}`);
    try {
      const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) throw new Error('No token');
      
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(token, { secret });
      
      client.data.user = payload;
      // Join personal room for notifications
      client.join(`user_${payload.sub}`);
      console.log(`[ChatGateway] Client connected: ${client.id}, User ID: ${payload.sub}`);
    } catch (error) {
      console.error(`[ChatGateway] Connection error:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[ChatGateway] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('bookingId') bookingId: string,
  ) {
    if (!client.data.user) return;
    client.join(`booking_${bookingId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string; content: string },
  ) {
    console.log(`[ChatGateway] Received message from ${client.id} in booking ${data.bookingId}: ${data.content}`);
    if (!client.data.user) {
      console.log(`[ChatGateway] Unauthorized send attempt from ${client.id}`);
      return;
    }
    const { bookingId, content } = data;
    const senderId = client.data.user.sub; // user ID from JWT payload

    // Save message to DB
    const savedMessage = await this.messagesService.saveMessage(bookingId, senderId, content);

    // Emit to everyone in the room
    this.server.to(`booking_${bookingId}`).emit('newMessage', savedMessage);

    // Emit global notification to the receiver
    this.server.to(`user_${savedMessage.receiverId}`).emit('notification', {
      type: 'NEW_MESSAGE',
      message: 'You have a new message',
      data: savedMessage
    });
  }
}
