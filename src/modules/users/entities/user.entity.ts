import { Column, Entity } from "typeorm";
import { AbstractEntity, AbstractIdentityEntity } from "../../../core/shared/abstract.entity";
import { UserResponseDto } from "../dto/user.dto";

@Entity('users')
export class UserEntity extends AbstractEntity<UserResponseDto> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  dtoClass = UserResponseDto;
}
