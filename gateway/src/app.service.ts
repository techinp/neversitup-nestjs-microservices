import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './dto/user.dto';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH') private readonly authClient: ClientProxy,
    @Inject('USER') private readonly userClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await lastValueFrom(
      this.userClient.send({ cmd: 'user/get' }, {}),
    );
    return users;
  }

  async createUser(data: User): Promise<User> {
    this.authClient.emit('user.create', data);
    this.userClient.emit('user.create', data);
    return data;
  }
}
