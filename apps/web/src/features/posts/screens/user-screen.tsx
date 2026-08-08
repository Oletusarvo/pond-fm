import { Separator } from '../../../components/separator';
import { PostFeed } from '../components/post-feed';
import { apiService } from '../../../utils/api-service';
import { Spinner } from '../../../components/spinner';
import { UserHeader } from '../components/user-header';
import { useUserContext } from '../../users/providers/user-proivder';
import { FeedProvider } from '../../../providers/feed-provider';
import { PopulatePostStore } from '../providers/populates-post-store';

/**@todo Implement fetching of the user from the database instead of passing an encoded object in the page params. */
export function UserScreen() {
  const userService = useUserContext();
  if (userService.isPending) {
    return <Spinner />
  }

  return (
    <div className='flex flex-col w-full max-h-full'>
      <UserHeader />
      <Separator />
      <FeedProvider
        queryFn={cursor => apiService.getAuthorFeed(userService.user.id, cursor)}
        queryKey={['feed', 'author', userService.user.id]}>
        <PopulatePostStore>
          <PostFeed />
        </PopulatePostStore>
      </FeedProvider>
    </div>
  );
}
