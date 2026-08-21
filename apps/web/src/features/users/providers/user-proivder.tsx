import { useParams } from "react-router-dom";
import { createProvider } from "../../../utils/create-provider";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../utils/api/api-service";
import { FollowerFeedModal } from "../components/follower-feed-modal";
import { FollowingFeedModal } from "../components/following-feed-modal";

export const [UserProvider, useUserContext] = createProvider({
  contextName: 'UserContext',
  hook: () => {
    const { id } = useParams();
    const { data: user, isPending } = useQuery({
      queryKey: ['user', id],
      queryFn: async () => {
        const res = await apiService.getUser(id);
        return res.ok ? await res.json() : null;
      }
    });

    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const toggleShowFollowerModal = (state: boolean) => setShowFollowerModal(state);
    const toggleShowFollowingModal = (state: boolean) => setShowFollowingModal(state);

    return {
      showFollowerModal, showFollowingModal, toggleShowFollowerModal, toggleShowFollowingModal, user, isPending,
    }
  },
  childComponent: (props) => {
    return <>
      {props.showFollowerModal ? <FollowerFeedModal /> : null}
      {props.showFollowingModal ? <FollowingFeedModal /> : null}
    </>
  }
})