import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { ProcessResponseDto } from './dto/process-response.dto';
import { ProcessTreeDto } from './dto/process-tree.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @ApiOperation({ summary: 'Create a new process' })
  @ApiResponse({
    status: 201,
    description: 'Process successfully created.',
    type: ProcessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiResponse({
    status: 404,
    description: 'Area or parent process not found.',
  })
  @Post()
  create(@Body() dto: CreateProcessDto) {
    return this.processesService.create(dto);
  }

  @ApiOperation({ summary: 'Retrieve all processes' })
  @ApiResponse({
    status: 200,
    description: 'List of processes retrieved successfully.',
    type: ProcessResponseDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.processesService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve all processes by area as a tree structure',
  })
  @ApiResponse({
    status: 200,
    description:
      'Hierarchical tree of processes for the area retrieved successfully.',
    type: ProcessTreeDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found.',
  })
  @Get('area/:areaId')
  findByArea(@Param('areaId') areaId: string) {
    return this.processesService.findByArea(areaId);
  }

  @ApiOperation({ summary: 'Retrieve a specific process by its identifier' })
  @ApiResponse({
    status: 200,
    description: 'Process retrieved successfully.',
    type: ProcessResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Process not found.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an existing process' })
  @ApiResponse({
    status: 200,
    description: 'Process updated successfully.',
    type: ProcessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  @ApiResponse({
    status: 404,
    description: 'Process not found.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProcessDto) {
    return this.processesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Remove a process from the system' })
  @ApiResponse({
    status: 200,
    description: 'Process removed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Process not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete process with children. Delete children first.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processesService.remove(id);
  }
}
