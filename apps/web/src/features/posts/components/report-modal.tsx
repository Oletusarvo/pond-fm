import { Info } from "lucide-react";
import { Modal } from "../../../components/modal";
import { useTrackContext } from "../providers/post-provider";
import { Form } from "../../../components/form";
import { Input, Textarea } from "../../../components/input";
import { Button } from "../../../components/button";
import { useToggleContext } from "../../../providers/toggle-provider";
import { useSubmit } from "../../../hooks/use-submit";
import { ErrorMessage } from "../../../components/helper-message";
import { useStopPropagation } from "../../../hooks/use-stop-propagation";

/**Renders the modal displayed when the report button is tapped. Must be rendered within a ToggleProvider.Target */
export function ReportModal() {
  const { toggleState: toggleModal } = useToggleContext();
  const close = useStopPropagation(() => toggleModal(false));
  return (
    <Modal title='Report Copyright Infringement' onClose={close}>
      <ModalContent close={close} />
    </Modal>
  );
}

function ModalContent({ close }) {
  const { track: post } = useTrackContext();
  const { submit, loading, status } = useSubmit({
    fetchFn: async (payload) => {
      console.log("Submitting...");
      return {
        success: false,
        error: "not-implemented",
      };
    },
    onError: (res) => {
      return res.error as string;
    },
  });

  return (
    <div className='flex flex-col overflow-hidden'>
      <h3 className='text-xl font-semibold'>Reporting {post.title}</h3>
      <p>
        Tracks displayed on Amphitune are hosted on Audius. Please click the button below so we can
        take you over to their reporting flow.
      </p>
      <div className='flex flex-col w-full gap-2 mt-8'>
        <Button
          type='button'
          variant='contained'
          fullWidth
          paddingEnabled
          shape='rounded'
          form='copyright-form'
        >
          Send
        </Button>
        <Button variant='ghost' onClick={close} fullWidth paddingEnabled shape='rounded'>
          Cancel
        </Button>
      </div>
    </div>
  );
}
