import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { FilterLogsDto } from './dto/filter-logs.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async findAll(filterLogsDto: FilterLogsDto): Promise<Log[]> {
    const { entity_type, action_type, entity_id, user_id } = filterLogsDto;

    const where: any = {};

    if (entity_type) {
      where.entity_type = entity_type;
    }
    if (action_type) {
      where.action_type = action_type;
    }
    if (entity_id) {
      where.entity_id = entity_id;
    }
    if (user_id) {
      where.user = { id: parseInt(user_id, 10) };
    }

    return this.logRepository.find({
      where,
    });
  }

  async findOne(id: number): Promise<Log> {
    const log = await this.logRepository.findOne({
      where: { id },
    });
    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
    return log;
  }

  async createLog(
    user: User,
    actionType: string,
    entityType: string,
    entityId: number,
    changes: string,
  ) {
    const log = this.logRepository.create({
      user,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      changes,
    });

    await this.logRepository.save(log);
  }
}
