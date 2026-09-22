import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { Button, LoaderButton } from "../../../components/button";
import { Input } from "../../../components/input";
import { Form } from "../../../components/form";
import { useAuthContext } from "../providers/auth-provider";
import { useSubmit } from "../../../hooks/use-submit";
import { ErrorMessage, SuccessMessage } from "../../../components/helper-message";
import { createProvider } from "../../../utils/create-provider";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

const [LoginProvider, useLoginContext] = createProvider({
  contextName: "LoginContext",
  hook: ({ close }: { close: () => void | Promise<void> }) => {
    const [search, setSearchParams] = useSearchParams();
    const returnUrl = search.get("return-url");
    const step = search.get("step");
    const [loginSuccess, setLoginSuccess] = useState(false);

    const updateStep = (step: string) => {
      setSearchParams({
        step,
      });
    };

    const updateLoginSuccess = (state: boolean) => setLoginSuccess(state);
    return {
      returnUrl,
      step,
      close,
      updateStep,
      loginSuccess,
      updateLoginSuccess,
    };
  },
});

export function LoginScreen() {
  const navigate = useNavigate();
  const close = () => navigate("/");
  return (
    <Modal title='Login' onClose={close}>
      <LoginProvider close={close}>
        <ModalContent />
      </LoginProvider>
    </Modal>
  );
}

//Render the content separately to stop the modal from re-rendering when the states change.
function ModalContent() {
  const { step, loginSuccess } = useLoginContext();
  const icon = loginSuccess ? (
    <LockOpen className='-rotate-30 w-12 h-12' />
  ) : (
    <Lock className='w-12 h-12' />
  );
  return (
    <div className='flex flex-col w-full gap-8'>
      <div className='w-full flex justify-center'>
        <div className='bg-primary/10 text-primary w-32 h-32 rounded-full flex items-center justify-center grow-0'>
          {icon}
        </div>
      </div>
      {step === "authorize" ? <AuthorizeStep /> : <CredentialsContent />}
    </div>
  );
}

function CredentialsContent() {
  const { close, updateStep } = useLoginContext();

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
      updateStep("authorize");
    },
  });
  return (
    <>
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
        {status === "auth:user-not-found" ? (
          <ErrorMessage>A user by that email does not exist.</ErrorMessage>
        ) : null}
      </Form>
    </>
  );
}

function AuthorizeStep() {
  const { close, returnUrl, updateLoginSuccess } = useLoginContext();
  const [params] = useSearchParams();
  const code = params.get("code");

  const navigate = useNavigate();
  const authService = useAuthContext();
  const { submit, loading, status } = useSubmit({
    fetchFn: async (payload) => {
      const data = Object.fromEntries(payload) as { code: string };
      return await authService.authorize(data.code);
    },
    onSuccess: () => {
      updateLoginSuccess(true);
      navigate(returnUrl || "/undiscovered");
    },
  });

  const buttonsDisabled = loading || status === "success";
  return (
    <>
      <p>To sign in, please submit the code we sent you.</p>
      <Form onSubmit={submit}>
        <Form.Group label='Code'>
          <Input
            name='code'
            type='text'
            required
            defaultValue={code}
            placeholder='Please paste the code we sent you here...'
          />
        </Form.Group>
        <div className='flex flex-col gap-2 w-full'>
          <LoaderButton
            loading={loading}
            disabled={buttonsDisabled}
            fullWidth
            paddingEnabled
            shape='rounded'
            type='submit'
          >
            {status !== "error" ? "Submit" : "Try Again"}
          </LoaderButton>
          <Button
            disabled={buttonsDisabled}
            variant='ghost'
            fullWidth
            paddingEnabled
            shape='rounded'
            onClick={close}
          >
            Cancel
          </Button>
        </div>
      </Form>
      {status === "success" ? (
        <SuccessMessage>
          Authorization succeeded! Please wait while we redirect you...
        </SuccessMessage>
      ) : status === "error" ? (
        <ErrorMessage>Authorization failed!</ErrorMessage>
      ) : status === "exception" ? (
        <ErrorMessage>Something went wrong!</ErrorMessage>
      ) : null}
    </>
  );
}
