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
  const hasUnseen = data?.some((item) => item?.seen_at == null);

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
    type === "like" ? { color: "transparent", fill: iconColor } : { color: iconColor };
  const isUnseen = notification?.seen_at === null;
  const message =
    type === "like"
      ? "liked your track"
      : type === "repost"
        ? "reposted your track"
        : "followed you";
  return (
    <div
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        isUnseen
          ? "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50"
          : "border-slate-100 bg-white hover:border-emerald-100 hover:bg-slate-50/70"
      }`}
      onClick={() => {
        toggleModalState(false);
        navigate(defaults.url.userTracks(notification.sender.id));
      }}
    >
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70'>
        <Icon {...iconProps} size='1.1rem' />
      </div>
      <div className='flex min-w-0 flex-1 flex-col items-start'>
        <div className='flex w-full min-w-0 items-start justify-between gap-3'>
          <div className='min-w-0 text-sm leading-5 text-slate-600'>
            <strong className='font-bold text-slate-900'>{notification.sender.username}</strong>{" "}
            <span>{message}</span>
            {notification.type !== "follow" ? (
              <span className='block truncate font-semibold text-emerald-800'>
                {notification.track?.title}
              </span>
            ) : null}
          </div>
          {isUnseen ? (
            <span className='shrink-0 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700'>
              New
            </span>
          ) : null}
        </div>
        <span className='mt-1 text-xs font-medium text-slate-500'>{timestamp}</span>
      </div>
    </div>
  );
}
