import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { LogsModule } from './logs/logs.module';
@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      // En PROD, syncronize debe estar en falsea
      synchronize: true,
    }),

    UsersModule,

    TasksModule,

    TagsModule,

    CommentsModule,

    AttachmentsModule,

    LogsModule,
  ],
})
export class AppModule {}