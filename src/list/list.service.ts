import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List , ListDocument } from 'src/models/list.schema';
import { Movie } from 'src/models/movie.schema';
import { TVShow } from 'src/models/tvshow.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private listModel: Model<ListDocument>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
  ) {}

  // Add an item to the list
  async addToList(userId: string, itemId: string, type: 'movie' | 'tvshow') {
    const list = await this.listModel.findOne({ userId });

    if (!list) {
      throw new NotFoundException('List not found for the user');
    }

    if (type === 'movie') {
      if (list.movies.includes(itemId)) {
        throw new BadRequestException('Movie already exists in the list');
      }
      list.movies.push(itemId);
    } else if (type === 'tvshow') {
      if (list.tvshows.includes(itemId)) {
        throw new BadRequestException('TV Show already exists in the list');
      }
      list.tvshows.push(itemId);
    }

    await list.save();
    return { message: 'Item added to the list' };
  }

  // Remove an item from the list
  async removeFromList(
    userId: string,
    itemId: string,
    type: 'movie' | 'tvshow',
  ) {
    const list = await this.listModel.findOne({ userId });

    if (!list) {
      throw new NotFoundException('List not found for the user');
    }

    if (type === 'movie') {
      const index = list.movies.indexOf(itemId);
      if (index === -1) {
        throw new NotFoundException('Movie not found in the list');
      }
      list.movies.splice(index, 1);
    } else if (type === 'tvshow') {
      const index = list.tvshows.indexOf(itemId);
      if (index === -1) {
        throw new NotFoundException('TV Show not found in the list');
      }
      list.tvshows.splice(index, 1);
    }

    await list.save();
    return { message: 'Item removed from the list' };
  }

  // List all items in the user's list with pagination
  async listMyItems(userId: string, limit: number, offset: number) {
    const list = await this.listModel.findOne({ userId });

    if (!list) {
      throw new NotFoundException('List not found for the user');
    }

    const movieItems = await this.movieModel
      .find({ _id: { $in: list.movies } })
      .skip(offset)
      .limit(limit);
    const tvShowItems = await this.tvShowModel
      .find({ _id: { $in: list.tvshows } })
      .skip(offset)
      .limit(limit);

    return { movies: movieItems, tvshows: tvShowItems };
  }

  // List users who have a particular item in their list
  async listUser(itemId: string, type: 'movie' | 'tvshow') {
    let usersWithItem;
    if (type === 'movie') {
      usersWithItem = await this.listModel
        .find({ movies: itemId })
        .select('userId');
    } else if (type === 'tvshow') {
      usersWithItem = await this.listModel
        .find({ tvshows: itemId })
        .select('userId');
    }

    if (!usersWithItem) {
      throw new NotFoundException(
        'No users found with this item in their list',
      );
    }

    return usersWithItem;
  }
}
