import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/user.dto';
import { AuthGuard } from '../../core/guards/auth.guard';

@Controller('users')  
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: UserCreateDto) {
    const user = await this.usersService.create(createUserDto);
    return user.toDto();
  }

}
