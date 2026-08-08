import { Repeat } from "lucide-react";
import { Modal } from "../../../components/modal";
import { usePostStore } from "../hooks/use-post";
import { usePostContext } from "../providers/post-provider";
import { Button } from "../../../components/button";
import { usePostActions } from "../hooks/use-post-actions";

export function RepostModal() {
  const { post, toggleRepost } = usePostContext();
  const postActions = usePostActions({ id: post.id });
  return (
    <Modal
      title='Repost Track'
      onClose={() => toggleRepost(false)}>
      <div className='flex flex-col w-full gap-4 items-center text-black'>
        <Repeat
          color='var(--color-primary)'
          size='3rem'
        />
        <span>
          You are about to repost <strong>{post?.track.title}</strong> by{' '}
          <strong>{post?.track.author.username}</strong>. Reposts cannot currently be undone. Are
          you sure?
        </span>

        <div className='flex gap-4 w-full'>
          <Button
            shape='rounded'
            paddingEnabled
            onClick={() => toggleRepost(false)}
            variant='outlined'
            fullWidth>
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
            fullWidth>
            <Repeat size='1rem' />
            Repost
          </Button>
        </div>
      </div>
    </Modal>
  )
}