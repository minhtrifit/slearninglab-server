import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import {
  userConnectDto,
  joinClassDto,
  acceptJoinClass,
  CreateChatDto,
} from './dto/create-socket.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    return this.socketService.getUserDisconnect(this.server, client.id);
  }

  @SubscribeMessage('get_connect')
  startListeners(
    @ConnectedSocket() client: Socket,
    @MessageBody() userConnectDto,
  ) {
    return this.socketService.startListeners(
      this.server,
      client,
      userConnectDto.username,
    );
  }

  @SubscribeMessage('join_class_request')
  joinClassRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinClassDto,
  ) {
    return this.socketService.joinClassRequest(
      this.server,
      client,
      joinClassDto,
    );
  }

  @SubscribeMessage('accept_join_class_request')
  acceptJoinClassRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() acceptJoinClass,
  ) {
    return this.socketService.acceptJoinClassRequest(
      this.server,
      client,
      acceptJoinClass,
    );
  }

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.socketService.createChat(
      createChatDto,
      client.id,
    );

    // Send event to client
    this.server.to(createChatDto.room).emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllChat')
  findAll(@MessageBody() { room }) {
    return this.socketService.findAll(room);
  }

  @SubscribeMessage('joinClassChat')
  joinRoom(
    @MessageBody('name') name: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);

    // console.log(client.rooms);

    return this.socketService.identify(name, client.id, room);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.socketService.getClientName(client.id);

    // Send event to client
    if (room) {
      this.server.to(room).emit('typing', { name, isTyping });
    } else {
      this.server.emit('typing', { name, isTyping });
    }
  }
}
