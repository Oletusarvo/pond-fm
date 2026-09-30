import { Button, LoaderButton } from "../../../components/button";
import { Modal } from "../../../components/modal";
import { useAction } from "../../../hooks/use-action";
import { useToggleContext } from "../../../providers/toggle-provider";
import { api } from "../../../utils/api/api";

export function ImportTracksModal() {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);
  const { action, status, loading } = useAction({
    fn: async () => {
      return await api.tracks.importFromAudius();
    },
    onSuccess: () => {
      onClose();
    },
    onError: (res) => {
      console.log(res.error);
    },
  });

  return (
    <Modal title='Import Audius Tracks' onClose={onClose}>
      <LoaderButton fullWidth loading={loading} disabled={loading} onClick={action}>
        Import Your Audius Tracks
      </LoaderButton>
    </Modal>
  );
}
