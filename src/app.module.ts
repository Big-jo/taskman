import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import database, { DatabaseConfig } from './core/config/database';
import redis, { RedisConfig, } from './core/config/redis';
import { AuthModule } from './modules/auth/auth.module';
import security, { SecurityConfig } from './core/config/security';
import { JwtModule } from '@nestjs/jwt';
import app from './core/config/app';
import { AuthMiddleware } from './core/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './modules/users/users.service';
import { NamingStrategy } from './core/database/naming.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database, redis, security, app],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        return {
          type: dbConfig.type as any,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          ssl: dbConfig.ssl,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/core/database/migrations/*{.ts,.js}'],
          migrationsRun: true,
          namingStrategy: new NamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        return {
          redis: {
            host: redisConfig.host,
            port: redisConfig.port,
            db: redisConfig.db,
            password: redisConfig.password,
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');

        return {
          secret: securityConfig.jwtSecret,
          signOptions: { expiresIn: securityConfig.jwtExpiry },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule, 
    TasksModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: any, res: any, next: any) => {
        const middleware = new AuthMiddleware(this.jwtService, this.usersService);
        return middleware.use(req, res, next);
      })
      .exclude('/auth')
      .exclude('/users')
      .exclude('/health')
      .exclude('/api/docs')
      .forRoutes('*');
  }
}
