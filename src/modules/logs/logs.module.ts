import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { Log } from './entities/log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [LogsController],
  providers: [LogsService],
  imports: [TypeOrmModule.forFeature([Log, User]), AuthModule],
  exports: [TypeOrmModule, LogsService],
})
export class LogsModule {}
