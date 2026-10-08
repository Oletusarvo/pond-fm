import { Repeat } from "lucide-react";
import { Modal } from "../../../components/modal";
import { useTrackStore } from "../hooks/use-track";
import { useTrackContext } from "../providers/post-provider";
import { Button } from "../../../components/button";
import { usePostActions } from "../hooks/use-post-actions";

/**Renders the modal prompting confirmation of reposts. */
export function RepostModal() {
  const { track: post, toggleRepost } = useTrackContext();
  const postActions = usePostActions({ trackId: post.id });
  return (
    <Modal title='Repost Track' onClose={() => toggleRepost(false)}>
      <div className='flex flex-col w-full gap-4 items-center text-black'>
        <Repeat color='var(--color-primary)' size='3rem' />
        <span>
          You are about to repost <strong>{post?.title}</strong> by{" "}
          <strong>{post?.author.username}</strong>. Reposts are a commitment and cannot be undone.
          Are you sure you wish to continue?
        </span>

        <div className='flex gap-4 w-full'>
          <Button
            shape='rounded'
            paddingEnabled
            onClick={() => toggleRepost(false)}
            variant='outlined'
            fullWidth
          >
            Cancel
          </Button>
          <Button
            shape='rounded'
            paddingEnabled
            onClick={() => {
              postActions.repost();
              toggleRepost(false);
            }}
            variant='contained'
            fullWidth
            icon={Repeat}
          >
            Repost
          </Button>
        </div>
      </div>
    </Modal>
  );
}
