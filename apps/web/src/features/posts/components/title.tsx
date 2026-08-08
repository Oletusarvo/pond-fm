import { usePostContext } from '../providers/post-provider';

export function Title() {
  const { post } = usePostContext();
  return <h2 className='font-semibold'>{post?.track.title}</h2>;
}
