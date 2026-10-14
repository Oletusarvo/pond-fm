import { Repeat } from "lucide-react";
import { Modal } from "../../../components/modal";
import { useTrackContext } from "../providers/post-provider";
import { usePostActions } from "../hooks/use-post-actions";

/**Renders the modal prompting confirmation of reposts. */
export function RepostModal() {
  const { track: post, toggleRepost } = useTrackContext();
  const postActions = usePostActions({ trackId: post.id });
  return (
    <Modal title='Repost Track' onClose={() => toggleRepost(false)}>
      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700'>
            <Repeat className='h-8 w-8' />
          </div>
        </div>
        <div className='mx-auto max-w-xl text-center'>
          <h2 className='text-xl font-bold text-slate-900'>Ready to repost?</h2>
          <p className='mt-2 wrap-break-word text-sm leading-6 text-slate-600'>
            Share <strong className='font-semibold text-slate-900'>{post?.title}</strong> by{" "}
            <strong className='font-semibold text-slate-900'>{post?.author.username}</strong> with
            the rest of the pond. Reposts cannot be undone.
          </p>
        </div>
        <div className='flex w-full flex-col gap-2'>
          <button
            type='button'
            onClick={() => {
              postActions.repost();
              toggleRepost(false);
            }}
            className='button --primary'
          >
            <Repeat className='h-4 w-4' />
            Repost
          </button>
          <button type='button' onClick={() => toggleRepost(false)} className='button --secondary'>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
