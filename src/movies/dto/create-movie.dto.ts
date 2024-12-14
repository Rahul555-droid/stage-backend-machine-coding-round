import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  genres: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsDateString)
  releaseDate: string; // Keep as string to match input

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  actors: string[];
}
