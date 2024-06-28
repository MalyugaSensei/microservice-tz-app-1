import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('no-problem')
  updateNoProblem() {
    return this.userService.updateNoProblem();
  }
}
