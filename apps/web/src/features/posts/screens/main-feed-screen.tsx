import { useState } from 'react';
import { useMainFeed } from '../hooks/use-main-feed';
import { Feed } from '../components/feed';
import { MainGenreTagList } from '../components/main-genre-tag-list';
import { Separator } from '../../../components/separator';

export function MainScreenFeed() {
  const [selectedTag, setSelectedTag] = useState(null);
  return (
    <div className='flex flex-col w-full max-h-full'>
      <div className='py-2 w-full h-pad'>
        <div className='flex flex-col pb-2'>
          <h2 className='font-semibold text-primary'>New Tracks</h2>
          <p className='text-slate-500 text-sm'>The newest of the new.</p>
        </div>
        <MainGenreTagList
          selectedTag={selectedTag}
          onSelected={tag =>
            setSelectedTag(prev => {
              return tag === prev ? null : tag;
            })
          }
        />
      </div>
      <Separator></Separator>
      <Feed queryHook={() => useMainFeed(selectedTag)} />
    </div>
  );
}
