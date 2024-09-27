import { IsNotEmpty, Length, IsString, IsAlphanumeric } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDTO {
  @ApiProperty()
  @Length(4, 20)
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
