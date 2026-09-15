import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { Button, LoaderButton } from "../../../components/button";
import { Input } from "../../../components/input";
import { Form } from "../../../components/form";
import { useAuthContext } from "../providers/auth-provider";
import { useSubmit } from "../../../hooks/use-submit";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/helper-message";

export function LoginScreen() {
  const navigate = useNavigate();
  const close = () => navigate("/");
  return (
    <Modal title='Login' onClose={close}>
      <ModalContent close={close} />
    </Modal>
  );
}

//Render the content separately to stop the modal from re-rendering when the states change.
function ModalContent({ close }) {
  const navigate = useNavigate();
  const authService = useAuthContext();
  const { submit, status, loading } = useSubmit({
    fetchFn: async (payload) => {
      const credentials = Object.fromEntries(payload) as {
        email: string;
        username?: string;
      };
      return await authService.requestAuthorization(credentials);
    },
    onError: async (res) => {
      return res.error as string;
    },
    onSuccess: () => {
      navigate("/authorize");
    },
  });

  return (
    <div className='flex flex-col w-full gap-8'>
      <p>
        We handle logins via magic-links at the moment. Please provide an email
        into which you'd like us to send it. An account will be created for you
        if you have never logged onto the platform before.
      </p>
      <Form onSubmit={submit}>
        <Form.Group label='Email'>
          <Input
            name='email'
            placeholder='Enter your email...'
            type='email'
            required
          />
          <span className='text-slate-500 text-xs'>
            Check your inbox for the magic-link. It’ll be valid for 15 minutes.
          </span>
        </Form.Group>

        <div className='flex gap-2 w-full'>
          <Button
            disabled={status === "success" || loading}
            type='button'
            onClick={close}
            fullWidth
            paddingEnabled
            variant='outlined'
            shape='rounded'
          >
            Cancel
          </Button>
          <LoaderButton
            disabled={loading || status === "success"}
            loading={loading}
            type='submit'
            fullWidth
            paddingEnabled
            variant='contained'
            shape='rounded'
          >
            Login
          </LoaderButton>
        </div>
        {status === "success" ? (
          <SuccessMessage>
            Please check your email. We have sent you a link through which to
            complete your login process.
          </SuccessMessage>
        ) : status === "auth:user-quota-exceeded" ? (
          <ErrorMessage>
            Unfortunately we do not accept more users at this time.
          </ErrorMessage>
        ) : null}
      </Form>
    </div>
  );
}
