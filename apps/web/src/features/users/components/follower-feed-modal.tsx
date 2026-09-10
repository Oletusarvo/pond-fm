import { useNavigate } from "react-router-dom";
import { FeedModal } from "../../../components/feed-modal";
import { Feed } from "../../../components/feed";
import { useUserContext } from "../providers/user-proivder";
import { FollowerItem } from "./follower-item";
import { api } from "../../../utils/api/api";

/**Renders the modal displaying a users followers. */
export function FollowerFeedModal() {
  const userService = useUserContext();
  const navigate = useNavigate();
  return (
    <FeedModal
      title={`Followers of ${userService.user.username}`}
      onClose={() => userService.toggleShowFollowerModal(false)}
      queryKey={["followers", userService.user?.id]}
      queryFn={(cursor) => api.users.getFollowers(userService.user?.id, cursor)}
    >
      <Feed
        renderComponent={({ item }) => (
          <FollowerItem
            user={item}
            onClick={() => {
              userService.toggleShowFollowerModal(false);
              navigate(`/user/${item.id}`);
            }}
          />
        )}
        keyExtractor={(item) => item?.id}
      />
    </FeedModal>
  );
}
