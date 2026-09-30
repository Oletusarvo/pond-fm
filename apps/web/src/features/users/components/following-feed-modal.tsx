import { useNavigate } from "react-router-dom";
import { FeedModal } from "../../../components/feed-modal";
import { Feed } from "../../../components/feed";
import { useUserContext } from "../providers/user-proivder";
import { FollowerItem } from "./follower-item";
import { api } from "../../../utils/api/api";
import { defaults } from "../../../utils/defaults";
import { useToggleContext } from "../../../providers/toggle-provider";

/**Renders the feed displaying who is following a user. */
export function FollowingFeedModal() {
  const { toggleState: toggleModal } = useToggleContext();
  const userService = useUserContext();
  return (
    <FeedModal
      title={`Users ${userService.user.username} follows`}
      onClose={() => toggleModal(false)}
      queryKey={["following", userService.user.audius_user_id]}
      queryFn={(cursor) => api.users.getFollowing(userService.user?.audius_user_id, cursor)}
    >
      <Feed
        renderComponent={({ item }) => <FollowerItem user={item} />}
        keyExtractor={(item) => item.id}
      />
    </FeedModal>
  );
}
