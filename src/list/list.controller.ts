import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListService } from './list.service';

@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // Add an item to the user's list
  @Post()
  @ApiOperation({ summary: 'Add an item (movie or tvshow) to the list' })
  @ApiResponse({ status: 201, description: 'Item added to the list' })
  @ApiResponse({ status: 400, description: 'Item already exists in the list' })
  async addToList(
    @Body('userId') userId: string,
    @Body('itemId') itemId: string,
    @Body('type') type: 'movie' | 'tvshow',
  ) {
    return this.listService.addToList(userId, itemId, type);
  }

  // Remove an item from the user's list
  @Delete()
  @ApiOperation({ summary: 'Remove an item (movie or tvshow) from the list' })
  @ApiResponse({ status: 200, description: 'Item removed from the list' })
  @ApiResponse({ status: 404, description: 'Item not found in the list' })
  async removeFromList(
    @Body('userId') userId: string,
    @Body('itemId') itemId: string,
    @Body('type') type: 'movie' | 'tvshow',
  ) {
    return this.listService.removeFromList(userId, itemId, type);
  }

  // Get all items in the user's list with pagination
  @Get()
  @ApiOperation({ summary: "Get all items in the user's list" })
  @ApiResponse({
    status: 200,
    description: "List of items in the user's list",
  })
  async listMyItems(
    @Query('userId') userId: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.listService.listMyItems(userId, limit, offset);
  }

  // Get a list of users who have a particular item in their list
  @Get('users/:itemId/:type')
  @ApiOperation({
    summary: 'Get all users who have a particular item in their list',
  })
  @ApiParam({ name: 'itemId', description: 'The item (movie/tvshow) ID' })
  @ApiParam({ name: 'type', description: 'Type of item (movie/tvshow)' })
  @ApiResponse({
    status: 200,
    description: 'List of users who have the item in their list',
  })
  async listUser(
    @Param('itemId') itemId: string,
    @Param('type') type: 'movie' | 'tvshow',
  ) {
    return this.listService.listUser(itemId, type);
  }
}
