import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { FilterLogsDto } from './dto/filter-logs.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async findAll(filterLogsDto: FilterLogsDto): Promise<Log[]> {
    const { entity_type, action_type, entity_id, user_id } = filterLogsDto;

    // Construcción dinámica del objeto de búsqueda
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
      where.user = { id: parseInt(user_id, 10) }; // Relación con la entidad User
    }

    return this.logRepository.find({
      where,
      relations: ['user', 'task'], // Incluir relaciones si es necesario
    });
  }

  async findOne(id: number): Promise<Log> {
    const log = await this.logRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });
    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
    return log;
  }
}
