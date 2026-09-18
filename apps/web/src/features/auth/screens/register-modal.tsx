import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { Button, LoaderButton } from "../../../components/button";
import { Input } from "../../../components/input";
import { Form } from "../../../components/form";
import { useAuthContext } from "../providers/auth-provider";
import { useSubmit } from "../../../hooks/use-submit";
import { ErrorMessage, SuccessMessage } from "../../../components/helper-message";
import { TUser } from "@pondfm/app-shared";

export function RegisterScreen() {
  const navigate = useNavigate();
  const close = () => navigate("/");
  return (
    <Modal title='Sign Up' onClose={close}>
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
      const credentials = Object.fromEntries(payload) as Pick<TUser, "email" | "username">;
      return await authService.signup(credentials);
    },
    onError: async (res) => {
      console.log(res);
      return res.error as string;
    },
  });

  return (
    <div className='flex flex-col w-full gap-8'>
      <p>
        Please provide your email and choose a username. We will send you a link through which to
        verify your email.
        <br />
        <Link to='/login' className='text-primary'>
          Already have an account? Log in here.
        </Link>
      </p>
      <Form onSubmit={submit}>
        <Form.Group label='Email'>
          <Input name='email' placeholder='Enter your email...' type='email' required />
        </Form.Group>
        <Form.Group label='Username'>
          <Input
            name='username'
            required
            placeholder='Please pick your username...'
            min={3}
            max={64}
          />
        </Form.Group>

        <div className='w-full flex items-center gap-2'>
          <input className='checkbox' type='checkbox' name='terms_accepted' required />
          <label>
            I have read, and accept the{" "}
            <Link to='/terms-of-service.pdf' className='text-primary'>
              Terms Of Service
            </Link>{" "}
            and the{" "}
            <Link to='/privacy-policy.pdf' className='text-primary'>
              Privacy Policy
            </Link>
          </label>
        </div>

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
            Sign up
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
            Please check your email. We have sent you a link through which to confirm your email.
          </SuccessMessage>
        ) : status === "auth:user-quota-exceeded" ? (
          <ErrorMessage>Unfortunately we do not accept more users at this time.</ErrorMessage>
        ) : status === "auth:duplicate-email" ? (
          <ErrorMessage>A user with your chosen email already exists!</ErrorMessage>
        ) : status === "auth:duplicate-username" ? (
          <ErrorMessage>A user with your chosen username already exists!</ErrorMessage>
        ) : null}
      </Form>
    </div>
  );
}
