import { useState } from 'react';
import { MainGenreTagList } from '../components/main-genre-tag-list';
import { useDiscoveryFeed } from '../hooks/use-discovery-feed';
import { Feed } from '../components/feed';
import { Separator } from '../../../components/separator';

export function DiscoveryFeedScreen() {
  const [selectedTag, setSelectedTag] = useState(null);
  return (
    <div className='flex flex-col w-full max-h-full'>
      <div className='py-2 w-full h-pad'>
        <h2 className='font-semibold text-primary'>Undiscovered Tracks</h2>
        <MainGenreTagList
          selectedTag={selectedTag}
          onSelected={tag =>
            setSelectedTag(prev => {
              return tag === prev ? null : tag;
            })
          }
        />
      </div>
      <Separator />
      <Feed queryHook={() => useDiscoveryFeed(selectedTag)} />
    </div>
  );
}
