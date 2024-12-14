import { Controller, Post, Get, Delete, Query, Body, Param } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('list')
@ApiTags('List') // Groups this controller under the "List" section in Swagger
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: 'Add an item to the list' }) // Describes the purpose of this endpoint
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        itemId: { type: 'string', description: 'ID of the movie or TV show' },
        type: { 
          type: 'string', 
          enum: ['movie', 'tvshow'], 
          description: 'Type of item (movie or TV show)' 
        },
      },
      required: ['itemId', 'type'],
    },
  })
  async addToList(@Body() body: { itemId: string; type: 'movie' | 'tvshow' }) {
    return this.listService.addToList(body.itemId, body.type);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve items from the list with pagination' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'offset', type: 'number', required: false, description: 'Offset for pagination' })
  async listMyItems(@Query('limit') limit = 10, @Query('offset') offset = 0) {
    return this.listService.listMyItems(+limit, +offset);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove an item from the list' })
  @ApiParam({ name: 'itemId', type: 'string', description: 'ID of the item to be removed' })
  @ApiQuery({
    name: 'type',
    type: 'string',
    enum: ['movie', 'tvshow'],
    required: true,
    description: 'Type of the item (movie or TV show)',
  })
  async removeFromList(
    @Param('itemId') itemId: string,
    @Query('type') type: 'movie' | 'tvshow',
  ) {
    return this.listService.removeFromList(itemId, type);
  }
}
