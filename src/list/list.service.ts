import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from 'src/models/movie.schema';
import { TVShow, TVShowDocument } from 'src/models/tvshow.schema';
import { User, UserDocument } from 'src/models/user.schema';
import { ContentType, ListItemDto } from './dto/list-item.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Add an item to the user's list.
   */
  async addToList(userId: string, createListItemDto: ListItemDto) {
    const { contentId, contentType } = createListItemDto;

    // Validate content existence (with caching)
    await this.validateContentExistence(contentId, contentType);

    // Fetch the user
    const user = await this.findUserById(userId);

    // Check for duplicate entry
    const isDuplicate = user.myList.some(
      (item) =>
        item.contentId === contentId && item.contentType === contentType,
    );
    if (isDuplicate) {
      throw new ConflictException('Item already exists in the list');
    }

    // Add item to the user's list
    user.myList.push({ contentId, contentType });
    await user.save();

    return { message: 'Item successfully added to the list' };
  }

  /**
   * Remove an item from the user's list.
   */
  async removeFromList(userId: string, itemId: string, type: ContentType) {
    const user = await this.findUserById(userId);

    // Filter the list to exclude the item
    const initialLength = user.myList.length;
    user.myList = user.myList.filter(
      (item) => !(item.contentId === itemId && item.contentType === type),
    );

    // If no item was removed, throw an error
    if (user.myList.length === initialLength) {
      throw new NotFoundException('Item not found in the list');
    }

    await user.save();
    return { message: 'Item successfully removed from the list' };
  }

  /**
   * List items in the user's list with pagination.
   */
  async listMyItems(userId: string, limit = 10, offset = 0) {
    const user = await this.userModel
      .findById(userId)
      .populate('myList.contentId') // Populate content details
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalItems = user.myList.length;
    const paginatedList = user.myList.slice(offset, offset + limit);

    return {
      totalItems,
      limit,
      offset,
      items: paginatedList,
    };
  }

  /**
   * Validate if a content item exists in the database (uses caching).
   */
  private async validateContentExistence(
    contentId: string,
    contentType: ContentType,
  ) {
    const model = contentType === 'Movie' ? this.movieModel : this.tvShowModel;
    const exists = await model.exists({ _id: contentId });

    if (!exists) {
      throw new NotFoundException('Invalid contentId or type');
    }
  }

  /**
   * Fetch a user by ID or throw an error if not found.
   */
  private async findUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
