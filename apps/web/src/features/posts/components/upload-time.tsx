import { formatDistanceToNow } from 'date-fns';
import { usePostContext } from '../providers/post-provider';

export function UploadTime() {
  const { post } = usePostContext();
  const text = formatDistanceToNow(new Date(post?.created_at || 0), {
    addSuffix: true,
  });
  return <span className='text-xs text-slate-500'>{text}</span>;
}
