import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List, ListDocument } from 'src/models/list.schema';
import { Movie, MovieDocument } from 'src/models/movie.schema';
import { TVShow, TVShowDocument } from 'src/models/tvshow.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private listModel: Model<ListDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShowDocument>,
  ) {}

  async addToList(itemId: string, type: 'movie' | 'tvshow') {
    // Step 1: Validate the item type and existence
    let itemExists = null;
    if (type === 'movie') {
      itemExists = await this.movieModel.exists({ _id: itemId });
    } else if (type === 'tvshow') {
      itemExists = await this.tvShowModel.exists({ _id: itemId });
    }

    if (!itemExists) {
      throw new BadRequestException('Invalid itemId or type.');
    }

    // Step 2: Check for duplicates
    const duplicate = await this.listModel.findOne({ itemId, type });
    if (duplicate) {
      throw new BadRequestException('Item already exists in the list.');
    }

    // Step 3: Add item to the list
    const newListItem = new this.listModel({ itemId, type });
    return newListItem.save();
  }

  // async listMyItems(limit = 10, offset = 0) {
  //   return this.listModel
  //     .find()
  //     .skip(offset)
  //     .limit(limit)
  //     .populate({
  //       path: 'itemId',
  //       select: 'title description', // Specify the fields to include in the populated document
  //     })
  //     .exec();
  // }

  async listMyItems(limit = 10, offset = 0) {
    return this.listModel.aggregate([
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'movies', // MongoDB collection name for movies
          localField: 'itemId',
          foreignField: '_id',
          as: 'movieDetails',
        },
      },
      {
        $lookup: {
          from: 'tvshows', // MongoDB collection name for TV shows
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
  }
  

  async removeFromList(itemId: string, type: 'movie' | 'tvshow') {
    const item = await this.listModel.findOneAndDelete({ itemId, type });
    if (!item) {
      throw new BadRequestException('Item not found in the list.');
    }
    return { message: 'Item successfully removed from the list.' };
  }
    
}
