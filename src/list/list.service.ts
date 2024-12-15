import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as NodeCache from 'node-cache';
import { Movie, MovieDocument } from 'src/models/movie.schema';
import { TVShow, TVShowDocument } from 'src/models/tvshow.schema';
import { User, UserDocument } from 'src/models/user.schema';
import { List, ListDocument } from 'src/models/list.schema';

@Injectable()
export class ListService {
  private cache = new NodeCache({ stdTTL: 300 }); // Cache with 5-minute TTL

  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(List.name) private listModel: Model<ListDocument>,
  ) {}

  // Add item to the user's list
  async addToList(userId: string, itemId: string, type: 'movie' | 'tvshow') {
    // Step 1: Validate content existence
    await this.validateItemExistence(itemId, type);

    // Step 2: Check for duplicates
    const isDuplicate = await this.checkDuplicateEntry(userId, itemId, type);
    if (isDuplicate) {
      throw new ConflictException('Item already exists in the list.');
    }

    // Step 3: Add to list
    const newListItem = new this.listModel({ userId, itemId, type });
    await newListItem.save();
    return { message: 'Item successfully added to the list.' };
  }

  // Remove item from the user's list
  async removeFromList(
    userId: string,
    itemId: string,
    type: 'movie' | 'tvshow',
  ) {
    const item = await this.listModel.findOneAndDelete({
      userId,
      itemId,
      type,
    });
    if (!item) {
      throw new NotFoundException('Item not found in the list.');
    }
    return { message: 'Item successfully removed from the list.' };
  }

  // List items in the user's list with pagination
  async listMyItems(userId: string, limit = 10, offset = 0) {
    const cacheKey = `list_${userId}_${limit}_${offset}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) return cachedData;

    // const populatedList = await Promise.all(
    //   user.myList.map(async (item) => {
    //     if (item.contentType === 'Movie') {
    //       const movie = await this.movieModel.findById(item.itemId).exec();
    //       return { ...item.toObject(), details: movie };
    //     } else if (item.contentType === 'TVShow') {
    //       const tvShow = await this.tvShowModel.findById(item.itemId).exec();
    //       return { ...item.toObject(), details: tvShow };
    //     }
    //     return item; // If contentType doesn't match, return as is.
    //   }),
    // );

    const items = await this.listModel.aggregate([
      { $match: { userId } },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'movies',
          localField: 'itemId',
          foreignField: '_id',
          as: 'movieDetails',
        },
      },
      {
        $lookup: {
          from: 'tvshows',
          localField: 'itemId',
          foreignField: '_id',
          as: 'tvShowDetails',
        },
      },
      {
        $project: {
          itemId: 1,
          type: 1,
          dateAdded: 1,
          movieDetails: { $arrayElemAt: ['$movieDetails', 0] },
          tvShowDetails: { $arrayElemAt: ['$tvShowDetails', 0] },
        },
      },
    ]);

    this.cache.set(cacheKey, items); // Cache results
    return items;
  }

  // Utility: Validate content existence
  private async validateItemExistence(
    itemId: string,
    type: 'movie' | 'tvshow',
  ) {
    const cacheKey = `content_${type}_${itemId}`;
    const cachedItem = this.cache.get(cacheKey);

    if (cachedItem) return cachedItem;

    const itemExists =
      type === 'movie'
        ? await this.movieModel.exists({ _id: itemId })
        : await this.tvShowModel.exists({ _id: itemId });

    if (!itemExists) {
      throw new NotFoundException('Invalid itemId or type.');
    }

    this.cache.set(cacheKey, true); // Cache validation
  }

  // Utility: Check duplicate entry
  private async checkDuplicateEntry(
    userId: string,
    itemId: string,
    type: 'movie' | 'tvshow',
  ) {
    const duplicate = await this.listModel.findOne({ userId, itemId, type });
    return !!duplicate;
  }
}
