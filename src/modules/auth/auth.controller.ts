import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate user and get JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Authentication successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  auth(@Body() dto: AuthDto) {
    return this.authService.auth(dto);
  }
}
