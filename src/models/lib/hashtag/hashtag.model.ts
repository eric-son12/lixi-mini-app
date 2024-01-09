import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GraphQLDateTime } from 'graphql-scalars';

import { HashtagDana } from './hashtag-dana.model';
import { PostHashtag } from './postHashtag.model';

@ObjectType()
export class Hashtag {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  normalizedContent: string;

  @Field(() => [PostHashtag], { nullable: true })
  postHashtags?: [PostHashtag];

  @Field(() => Float)
  danaBurnUp: number;

  @Field(() => Float)
  danaBurnDown: number;

  @Field(() => Float)
  danaBurnScore: number;

  @IsOptional()
  @Field(() => HashtagDana, { nullable: true })
  hashtagDana?: Nullable<HashtagDana>;

  @Field(() => GraphQLDateTime, {
    description: 'Identifies the date and time when the object was created.',
    nullable: true
  })
  createdAt?: Date;

  @Field(() => GraphQLDateTime, {
    description: 'Identifies the date and time when the object was last updated.',
    nullable: true
  })
  updatedAt?: Date;
}
