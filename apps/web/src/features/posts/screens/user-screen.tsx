import { useParams } from 'react-router-dom';
import { Separator } from '../../../components/separator';
import { ObjectEncoder } from '../../../utils/object-encoder';
import { FeedProvider } from '../../../providers/feed-provider';
import { PostFeed } from '../components/post-feed';
import { apiService } from '../../../utils/api-service';

/**@todo Implement fetching of the user from the database instead of passing an encoded object in the page params. */
export function UserScreen() {
  const { userDataBase64Url } = useParams();
  const user = ObjectEncoder.decodeFromBase64Url(userDataBase64Url);

  return (
    <div className='flex flex-col w-full max-h-full'>
      <div className='py-2 w-full h-pad leading-none flex flex-col'>
        <span className='text-xs text-slate-500'>Tracks By</span>
        <h2 className='text-lg font-semibold text-primary'>{user.username}</h2>
      </div>
      <Separator />
      <FeedProvider
        queryFn={cursor => apiService.getAuthorFeed(user.id, cursor)}
        queryKey={['feed', 'author', user.id]}>
        <PostFeed />
      </FeedProvider>
    </div>
  );
}
