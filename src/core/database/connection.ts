import { DataSource } from 'typeorm';
import { NamingStrategy } from './naming.strategy';

// Import all entities
import { UserEntity } from '../../modules/users/entities/user.entity';
import { TaskEntity } from '../../modules/tasks/entities/task.entity';
import { CommentEntity } from '../../modules/tasks/entities/comment.entity';


const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
  username: process.env.DATABASE_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || process.env.DB_DATABASE || 'taskman-db',
  synchronize: false, // Always false for migrations
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/core/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  namingStrategy: new NamingStrategy(),
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
  } : false,
});

export default dataSource;
