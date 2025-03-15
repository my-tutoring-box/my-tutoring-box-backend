import { Body, Controller, Post } from '@nestjs/common';
import { ApiSuccessResponse } from 'src/libs/shared/src/interfaces/api.interface';
import { User } from 'src/libs/shared/src/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async register(@Body() user: User): Promise<ApiSuccessResponse<User>> {
    const data = await this.authService.register(user);
    console.log(data);
    return {
      status: 'success',
      data: data,
    };
  }
}
