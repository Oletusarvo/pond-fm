import { Info } from "lucide-react";
import { Modal } from "../../../components/modal";
import { usePostContext } from "../providers/post-provider";
import { Form } from "../../../components/form";
import { Input, Textarea } from "../../../components/input";
import { Button } from "../../../components/button";
import { useToggleContext } from "../../../providers/toggle-provider";
import { useSubmit } from "../../../hooks/use-submit";
import { ErrorMessage } from "../../../components/helper-message";

/**Renders the modal displayed when the report button is tapped. Must be rendered within a ToggleProvider.Target */
export function ReportModal() {
  const { toggleState: toggleModal } = useToggleContext();
  const close = () => toggleModal(false);
  return (
    <Modal title='Report Copyright Infringement' onClose={close}>
      <ModalContent close={close} />
    </Modal>
  );
}

function ModalContent({ close }) {
  const { post } = usePostContext();
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
    <div className='flex flex-col gap-8 overflow-hidden'>
      <div className='flex flex-col gap-8 overflow-y-scroll h-full'>
        <div className='flex flex-col gap-4 items-start'>
          <h2 className='font-semibold text-lg'>Reporting {post.track.title}</h2>
          <div className=' flex gap-2 items-center font-mono text-xs p-1 bg-primary/10 text-primary border-primary/20 border rounded-md'>
            <Info size='1rem' />
            <span>{post.track.id}</span>
          </div>
          <p className='leading-5'>
            We take copyright infringement seriously. Please provide the following information for
            us so we can review the content.{" "}
          </p>
        </div>
        <Form onSubmit={submit} id='copyright-form'>
          <Form.Group label='Track ID'>
            <Input
              name='content_id'
              placeholder='The id of the content...'
              defaultValue={post.track.id}
            />
          </Form.Group>
          <Form.Group label='Name'>
            <Input name='name' placeholder='Your name...' />
          </Form.Group>
          <Form.Group label='Your Email'>
            <Input
              type='email'
              name='email'
              placeholder='The email to which you prefer receiving further communications regarding the report...'
              required
            />
          </Form.Group>
          <Form.Group label='Are you the copyright owner or authorized to represent them?'>
            <input type='checkbox' name='is_representative' className='ml-1 checkbox' />
          </Form.Group>
          <Form.Group label='Country'>
            <Input
              name='country'
              placeholder='The country/territory within which you believe your rights are being violated... '
            />
          </Form.Group>
          <Form.Group label='Message'>
            <Textarea
              name='message'
              required
              placeholder='Please provide additional information why you believe this content is infringing...'
            />
          </Form.Group>
          <Form.Group label='I confirm the information provided is in good faith and is accurate'>
            <input type='checkbox' name='is_accurate' className='ml-1 checkbox' />
          </Form.Group>
        </Form>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <Button
          type='submit'
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
      {status === "not-implemented" ? (
        <ErrorMessage>
          This functionality has not yet been implemented! We appologize for the inconvenience
        </ErrorMessage>
      ) : null}
    </div>
  );
}
