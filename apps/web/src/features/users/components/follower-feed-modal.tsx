import { useNavigate } from "react-router-dom";
import { FeedModal } from "../../../components/feed-modal";
import { Feed } from "../../../components/feed";
import { useUserContext } from "../providers/user-proivder";
import { FollowerItem } from "./follower-item";
import { api } from "../../../utils/api/api";
import { defaults } from "../../../utils/defaults";
import { useToggleContext } from "../../../providers/toggle-provider";

/**Renders the modal displaying a users followers. */
export function FollowerFeedModal() {
  const { toggle: toggleModal } = useToggleContext();
  const userService = useUserContext();
  return (
    <FeedModal
      title={`Followers of ${userService.user.username}`}
      onClose={() => toggleModal(false)}
      queryKey={["followers", userService.user?.id]}
      queryFn={(cursor) => api.users.getFollowers(userService.user?.id, cursor)}
    >
      <Feed
        renderComponent={({ item }) => <FollowerItem user={item} />}
        keyExtractor={(item) => item?.id}
      />
    </FeedModal>
  );
}
