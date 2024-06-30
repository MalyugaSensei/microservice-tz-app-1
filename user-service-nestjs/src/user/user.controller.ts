import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('no-problem')
  updateNoProblem() {
    try {
      return await this.userService.updateNoProblem();
    } catch (error) {
      throw new HttpException('Failed to update', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
