import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

import {
  joinClassDto,
  acceptJoinClass,
  CreateChatDto,
} from './dto/create-socket.dto';
import { ChatType } from 'src/types';

@Injectable()
export class SocketService {
  users: { uid: string; clientId: string; username: string }[] = [];
  messages: ChatType[] = [
    {
      name: 'Minh Trí',
      text: 'Hello',
      room: '8efb0a3d-f0ae-4132-b658-0e6abdf873ee',
    },
    {
      name: 'Maria',
      text: 'Love you',
      room: '8efb0a3d-f0ae-4132-b658-0e6abdf873ee',
    },
    {
      name: 'Tommy',
      text: 'Ahihi',
      room: '05acedc4-5262-417b-b8a4-0cc38b42496a',
    },
  ];
  clientToUser = {};
  userJoinedList = [];

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

  checkExistJoined(clientId: string, name: string, room: string) {
    // console.log('OK1:', clientId, name, room);

    // eslint-disable-next-line no-var
    for (var i = 0; i < this.userJoinedList.length; ++i) {
      if (
        this.userJoinedList[i].name === name &&
        this.userJoinedList[i].clientId === clientId &&
        this.userJoinedList[i].room === room
      ) {
        return true;
      }

      if (
        this.userJoinedList[i].name === name &&
        this.userJoinedList[i].clientId !== clientId &&
        this.userJoinedList[i].room === room
      ) {
        this.userJoinedList[i].clientId = clientId;
        return true;
      }
    }

    return false;
  }

  startListeners(server: Server, client: Socket, username: string) {
    console.log('Message received from ' + client.id);

    const checkUser = this.getUidFromUsername(username);

    if (checkUser) {
      // Send event to client
      server.to(client.id).emit('user_exist', 'Username is exist');

      this.getConnectUserAmount(server);

      // console.log(this.users);

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

      // console.log(this.users);

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

    this.userJoinedList = this.userJoinedList.filter((user) => {
      return user.clientId !== clientId;
    });

    // console.log('Check joined: ', this.userJoinedList);

    // Send event to client
    server.emit('user_disconnect', findUser[0]);

    console.log('Client disconnected:', clientId);

    server.emit('connect_users_amount', this.users.length);

    // console.log(this.users);
  }

  joinClassRequest(server: Server, client: Socket, joinClassDto: joinClassDto) {
    const findTeacher = this.users.filter((user) => {
      return user.username === joinClassDto.teacherUsername;
    });

    if (findTeacher.length !== 0) {
      const uid = v4();

      // Send event to client
      server.to(findTeacher[0].clientId).emit('join_class_notification', {
        ...joinClassDto,
        type: 'join',
        id: uid,
      });
      return true;
    } else {
      return false;
    }
  }

  acceptJoinClassRequest(
    server: Server,
    client: Socket,
    acceptJoinClass: acceptJoinClass,
  ) {
    const findStudent = this.users.filter((user) => {
      return user.username === acceptJoinClass.userJoinedUsername;
    });

    if (findStudent.length !== 0) {
      const uid = v4();

      // Send event to client
      server
        .to(findStudent[0].clientId)
        .emit('accept_join_class_notification', {
          ...acceptJoinClass,
          type: 'accept_join',
          id: uid,
        });
      return true;
    } else {
      return false;
    }
  }

  //==================== Chat logic

  createChat(createChatDto: CreateChatDto, clientId: string) {
    // console.log(createChatDto, this.clientToUser, clientId);

    const message = {
      name: this.clientToUser[clientId],
      text: createChatDto.text,
      room: createChatDto.room,
    };

    this.messages.push(message);

    return message;
  }

  findAll(room: string) {
    // console.log('BEFORE', this.messages);
    const roomMessages = this.messages.filter((msg) => {
      return msg.room === room;
    });

    // console.log('AFTER', roomMessages);

    return roomMessages;
  }

  identify(name: string, clientId: string, room: string) {
    this.clientToUser[clientId] = name;

    for (const key in this.clientToUser) {
      if (!this.checkExistJoined(key, this.clientToUser[key], room)) {
        this.userJoinedList.push({
          name: `${this.clientToUser[key]}`,
          clientId: key,
          room: room,
        });
      }
    }

    return this.userJoinedList;
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
