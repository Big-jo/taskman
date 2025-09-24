import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity, AbstractIdentityEntity } from './abstract.entity';
import { timeStamp } from 'console';

export class AbstractDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  readonly id: string;

  @ApiProperty({ example: '2021-01-01' })
  readonly createdAt: Date;

  @ApiProperty({ example: '2021-01-01' })
  readonly updatedAt: Date;

  @ApiProperty({ example: '2021-01-01' })
  readonly deletedAt: Date;
  
  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}


export class AbstractIdentityDto {
  @ApiProperty({ example: 1 })
  readonly id: number;


  @ApiProperty({ example: '2021-01-01' })
  readonly createdAt: Date;

  @ApiProperty({ example: '2021-01-01' })
  readonly updatedAt: Date;

  constructor(entity: AbstractIdentityEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt
  }
}
