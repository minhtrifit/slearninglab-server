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
}
