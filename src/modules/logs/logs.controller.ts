import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { LogsService } from './logs.service';
import { FilterLogsDto } from './dto/filter-logs.dto';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Log } from './entities/log.entity';
import { Auth } from '../auth/decorators';

@ApiTags('Logs')
@Controller('logs')
@Auth()
export class LogsController {
  private readonly logger = new Logger(LogsController.name);

  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOkResponse({
    type: [Log],
    description: 'Get a list of logs with filters',
  })
  async findAll(@Query() filterLogsDto: FilterLogsDto) {
    return this.logsService.findAll(filterLogsDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Log, description: 'Get a log by ID' })
  @ApiResponse({ status: 404, description: 'Log not found' })
  async findOne(@Param('id') id: number) {
    return this.logsService.findOne(id);
  }
}
