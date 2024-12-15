import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { ListService } from './list.service';
import { ContentType, ListItemDto } from './dto/list-item.dto';

@Controller('list')
@ApiTags('List') // Groups this controller under the "List" section in Swagger
@UseGuards(AuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: 'Add an item to the list' }) // Describes the purpose of this endpoint
  async addToList(
    @Body() listItemDto: ListItemDto,
    @Req() req: Request, // Extract userId from request
  ) {
    const userId = req['user'].id; // Assume the payload contains `id`
    return this.listService.addToList(userId, listItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve items from the list with pagination' })
  async listMyItems(
    @Req() req: Request,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const userId = req['user'].id;
    return this.listService.listMyItems(userId, +limit, +offset);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove an item from the list' })
  async removeFromList(
    @Param('itemId') itemId: string,
    @Query('type') type: ContentType,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.listService.removeFromList(userId, itemId, type);
  }
}
