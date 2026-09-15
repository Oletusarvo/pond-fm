import { Heart, Repeat, UserPlus } from "lucide-react";
import { Modal } from "../../../components/modal";
import { useNotificationsContext } from "../providers/notifications-provider";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Feed } from "../../../components/feed";
import { useFeedContext } from "../../../providers/feed-provider";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleContext } from "../../../providers/toggle-provider";
import { api } from "../../../utils/api/api";
import { defaults } from "../../../utils/defaults";

export function NotificationsModal() {
  const { toggleState } = useToggleContext();
  return (
    <Modal title='Notifications' onClose={() => toggleState(false)}>
      <ModalContent />
    </Modal>
  );
}

function ModalContent() {
  const queryClient = useQueryClient();
  const { data } = useFeedContext();
  const hasUnseen = data?.some((item) => item.seen_at == null);

  useEffect(() => {
    if (hasUnseen) {
      api.users.notifications
        .markAsSeen()
        .then(() => {})
        .catch((err) => {
          console.log("Failed to mark notifications as seen!", err.message);
        });
      return () => {
        console.log("Updating notifications cache");
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      };
    }
  }, [hasUnseen]);

  return (
    <Feed
      adsEnabled={false}
      renderComponent={({ item }) => <Notification notification={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

function Notification({ notification }) {
  const navigate = useNavigate();
  const { toggleState: toggleModalState } = useToggleContext();
  const timestamp = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const { type } = notification;
  const Icon = type === "like" ? Heart : type === "repost" ? Repeat : UserPlus;
  const iconColor =
    type === "like"
      ? "var(--color-red-500)"
      : type === "repost"
        ? "var(--color-blue-500)"
        : "var(--color-primary)";
  const iconProps =
    type === "like"
      ? { color: "transparent", fill: iconColor }
      : { color: iconColor };
  const message =
    type === "like"
      ? "liked your track"
      : type === "repost"
        ? "reposted your track"
        : "followed you";
  return (
    <div
      className='flex w-full items-center text-black gap-2 py-4 cursor-pointer'
      onClick={() => {
        toggleModalState(false);
        navigate(defaults.url.userTracks(notification.sender.id));
      }}
    >
      <Icon {...iconProps} size='1.2rem' />
      <div className='flex flex-col flex-1 items-start'>
        <div className='flex flex-col items-start text-sm'>
          <div className='flex items-center gap-2'>
            <strong>{notification.sender.username}</strong>
            <span className='text-nowrap'>{message}</span>
          </div>

          {notification.type !== "follow" ? (
            <strong className='text-primary'>
              {notification.track?.title}
            </strong>
          ) : null}

          {notification.seen_at === null ? (
            <div className='rounded-md px-1 border-primary/20 bg-primary/10 text-primary text-xs'>
              New
            </div>
          ) : null}
        </div>
        <span className='text-slate-500 text-sm'>{timestamp}</span>
      </div>
    </div>
  );
}
