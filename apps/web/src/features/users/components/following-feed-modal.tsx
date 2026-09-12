import { useNavigate } from "react-router-dom";
import { FeedModal } from "../../../components/feed-modal";
import { Feed } from "../../../components/feed";
import { useUserContext } from "../providers/user-proivder";
import { FollowerItem } from "./follower-item";
import { api } from "../../../utils/api/api";
import { defaults } from "../../../utils/defaults";

/**Renders the feed displaying the users another is following. */
export function FollowingFeedModal() {
  const userService = useUserContext();
  const navigate = useNavigate();
  return (
    <FeedModal
      title={`Users ${userService.user.username} follows`}
      onClose={() => userService.toggleShowFollowingModal(false)}
      queryKey={["following", userService.user.id]}
      queryFn={(cursor) => api.users.getFollowing(userService.user?.id, cursor)}
    >
      <Feed
        renderComponent={({ item }) => (
          <FollowerItem
            user={item}
            onClick={() => {
              userService.toggleShowFollowingModal(false);
              navigate(defaults.url.userTracks(item.id));
            }}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </FeedModal>
  );
}
