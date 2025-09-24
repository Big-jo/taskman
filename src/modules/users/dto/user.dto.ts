import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto, AbstractIdentityDto } from "../../../core/shared/abstract.dto";
import { UserEntity } from "../entities/user.entity";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { Transform } from "class-transformer";

export class UserResponseDto extends AbstractDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'test@test.com' })
  email: string;

  constructor(user: UserEntity) {
    super(user);
    
    this.name = user.name;
    this.email = user.email;
  }
}

export class UserCreateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  password: string;
}