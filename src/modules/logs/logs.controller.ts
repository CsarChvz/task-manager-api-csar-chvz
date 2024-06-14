import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { LogsService } from './logs.service';
import { FilterLogsDto } from './dto/filter-logs.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Log } from './entities/log.entity';
import { Auth } from '../auth/decorators';

@ApiTags('Logs')
@Controller('logs')
@Auth()
export class LogsController {
  private readonly logger = new Logger(LogsController.name);

  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of logs with filters' })
  @ApiOkResponse({
    type: [Log],
    description: 'Retrieve a list of logs, optionally filtered by criteria.',
  })
  async findAll(@Query() filterLogsDto: FilterLogsDto) {
    return this.logsService.findAll(filterLogsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a log by ID' })
  @ApiOkResponse({ type: Log, description: 'Retrieve a specific log by ID.' })
  @ApiResponse({ status: 404, description: 'Log not found' })
  async findOne(@Param('id') id: number) {
    return this.logsService.findOne(id);
  }
}
