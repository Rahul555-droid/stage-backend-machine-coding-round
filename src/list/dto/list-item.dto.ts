import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export enum ContentType {
  MOVIE = 'Movie',
  TV_SHOW = 'TVShow',
}

export class ListItemDto {
  @ApiProperty()
  @IsMongoId()
  contentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ContentType)
  contentType: ContentType;
}
