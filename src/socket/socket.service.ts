import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

@Injectable()
export class SocketService {
  users: { uid: string; clientId: string; username: string }[] = [];

  getUidFromUsername = (username: string) => {
    const existUser = this.users.filter((user) => {
      return user.username === username;
    });

    if (existUser.length !== 0) return true;
    else return false;
  };

  getConnectUserAmount(server: Server) {
    server.emit('connect_users_amount', this.users.length);

    return this.users.length;
  }

  startListeners(server: Server, client: Socket, username: string) {
    console.log('Message received from ' + client.id);

    const checkUser = this.getUidFromUsername(username);

    if (checkUser) {
      // Send event to client
      server.to(client.id).emit('user_exist', 'Username is exist');

      this.getConnectUserAmount(server);

      console.log(this.users);

      return false;
    } else {
      const uid = v4();

      this.users.push({
        uid: uid,
        clientId: client.id,
        username: username,
      });

      // Send event to client
      server
        .to(client.id)
        .emit('user_connected', { clientId: client.id, uid: uid });

      console.log(this.users);

      this.getConnectUserAmount(server);

      return true;
    }
  }

  getUserDisconnect(server: Server, clientId: string) {
    const findUser = this.users.filter((user) => {
      return user.clientId === clientId;
    });

    this.users = this.users.filter((user) => {
      return user.clientId !== clientId;
    });

    // Send event to client
    server.emit('user_disconnect', findUser[0]);

    console.log('Client disconnected:', clientId);

    server.emit('connect_users_amount', this.users.length);

    console.log(this.users);
  }
}
