import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { Button, LoaderButton } from "../../../components/button";
import { Input } from "../../../components/input";
import { Form } from "../../../components/form";
import { useAuthContext } from "../providers/auth-provider";
import { useSubmit } from "../../../hooks/use-submit";
import { ErrorMessage, SuccessMessage } from "../../../components/helper-message";

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
        We handle logins via magic-links at the moment. Please provide an email into which you'd
        like us to send it.
        <br />
        <Link to='/signup' className='text-primary'>
          Don't have an account? Create one here.
        </Link>
      </p>
      <Form onSubmit={submit}>
        <Form.Group label='Email'>
          <Input name='email' placeholder='Enter your email...' type='email' required />
        </Form.Group>

        <div className='flex flex-col gap-2 w-full items-center'>
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
          <Button
            disabled={status === "success" || loading}
            type='button'
            onClick={close}
            fullWidth
            paddingEnabled
            variant='ghost'
            shape='rounded'
          >
            Cancel
          </Button>
        </div>
        {status === "success" ? (
          <SuccessMessage>
            Please check your email. We have sent you a link through which to complete your login
            process.
          </SuccessMessage>
        )  : status === "auth:user-not-found" ? (
          <ErrorMessage>A user by that email does not exist.</ErrorMessage>
        ) : null}
      </Form>
    </div>
  );
}
