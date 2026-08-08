import { Feed } from "./feed";
import { FeedProvider } from "../providers/feed-provider";
import { Modal } from "./modal"

type FeedModalProps = React.ComponentProps<typeof Modal> & {
  queryKey: string[];
  queryFn: (cursor?: string) => Promise<Response>;
}
export function FeedModal({ children, queryKey, queryFn, ...props }: FeedModalProps) {
  return <Modal {...props}>
    <FeedProvider queryKey={queryKey} queryFn={queryFn}>
      {children}
    </FeedProvider>
  </Modal>
}