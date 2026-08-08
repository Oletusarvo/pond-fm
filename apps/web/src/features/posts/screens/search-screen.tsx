import { useState } from 'react';
import { SearchBar } from '../../../components/search-bar';
import { Feed } from '../../../components/feed';
import { useSearchableFeed } from '../hooks/use-searchable-feed';
import { debounce } from '../../../utils/debounce';
import { PostFeed } from '../components/post-feed';

export function SearchScreen() {
  const [currentSearch, setCurrentSearch] = useState(null);
  const onSearch = debounce((search: string) => {
    setCurrentSearch(search == '' ? null : search);
  }, 700);

  return (
    <div className='flex flex-col w-full max-h-full'>
      <SearchBar onSearch={onSearch} />
      <PostFeed queryHook={() => useSearchableFeed(currentSearch)} />
    </div>
  );
}
