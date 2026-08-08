import { useNavigate } from "react-router-dom";
import { FeedModal } from "../../../components/feed-modal";
import { apiService } from "../../../utils/api-service";
import { Feed } from "../../../components/feed";
import { useUserContext } from "../providers/user-proivder";
import { FollowerItem } from "./follower-item";

export function FollowingFeedModal() {
  const userService = useUserContext();
  const navigate = useNavigate();
  return <FeedModal title="Following"
    onClose={() => userService.toggleShowFollowingModal(false)}
    queryKey={['following', userService.user.id]}
    queryFn={cursor => apiService.getFollowing(userService.user?.id, cursor)}>
    <Feed renderComponent={({ item }) => <FollowerItem user={item} onClick={() => {
      userService.toggleShowFollowingModal(false);
      navigate(`/user/${item.id}`);
    }} />} keyExtractor={item => item.id} />
  </FeedModal>
}