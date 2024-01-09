import { createUnionType, Field, ID, ObjectType } from '@nestjs/graphql';

import { Post } from '../post';

export const TimelineItemData = createUnionType({
  name: 'TimelineItemData',
  types: () => [Post] as const,
  resolveType(value) {
    switch (value.constructor.name) {
      case 'Post':
      default:
        return Post;
    }
  }
});

@ObjectType()
export class TimelineItem {
  @Field(() => ID)
  id: string;

  @Field(() => TimelineItemData)
  data: typeof TimelineItemData;

  constructor(partial: Partial<TimelineItem>) {
    Object.assign(this, partial);
  }
}
