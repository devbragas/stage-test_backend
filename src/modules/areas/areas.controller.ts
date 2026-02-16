import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaResponseDto } from './dto/area-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @ApiOperation({ summary: 'Create a new organizational area' })
  @ApiResponse({
    status: 201,
    description: 'Organizational area successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiResponse({
    status: 409,
    description: 'An area with the same name already exists.',
  })
  @Post()
  create(@Body() dto: CreateAreaDto) {
    return this.areasService.create(dto);
  }

  @ApiOperation({
    summary: 'Retrieve all registered organizational areas',
  })
  @ApiResponse({
    status: 200,
    description: 'List of organizational areas retrieved successfully.',
    type: AreaResponseDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve a specific organizational area by its identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizational area retrieved successfully.',
    type: AreaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID type',
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found.',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update an existing organizational area',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizational area updated successfully.',
    type: AreaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found.',
  })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAreaDto) {
    return this.areasService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Remove an organizational area from the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizational area removed successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Area not found.',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.remove(id);
  }
}
