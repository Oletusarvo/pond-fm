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
import { useEffect, useState } from "react";
import { useAction } from "../../../hooks/use-action";
import { api } from "../../../utils/api/api";
import { Spinner } from "../../../components/spinner";
import { apiService } from "../../../utils/api/api-service";
import { useQuery } from "@tanstack/react-query";
import { useStatus } from "../../../hooks/use-status";

const [LoginProvider, useLoginContext] = createProvider({
  contextName: "LoginContext",
  hook: ({ close }: { close: () => void | Promise<void> }) => {
    const [search, setSearchParams] = useSearchParams();
    const returnUrl = search.get("return");
    const step = search.get("step");
    const [loginSuccess, setLoginSuccess] = useState(false);

    const updateStep = (step: string) => {
      let options: { step: string; returnUrl?: string; callbackUrl?: string } = {
        ...Object.fromEntries(search),
        step,
      };

      setSearchParams(options);
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
  const [search] = useSearchParams();
  const close = () => {
    const returnUrl = search.get("return");
    navigate(returnUrl || "/");
  };
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
  const { close } = useLoginContext();
  const login = () => {
    const url = import.meta.env.PROD
      ? "https://pond-fm-api.onrender.com/api/v1/auth/audius/authorize"
      : "http://localhost:3002/api/v1/auth/audius/authorize";
    window.location.href = url;
  };

  return (
    <>
      <p className='text-center'>
        Please continue by clicking the button below. You will be redirected to the Audius login
        screen. Amphitune will never have access to your credentials.
        <br />
        <Link to='https://audius.co/signup/create-email' className='text-primary'>
          Don't have an Audius account? Create one here.
        </Link>
      </p>

      <div className='flex flex-col gap-2 w-full items-center'>
        <Button onClick={login} fullWidth paddingEnabled variant='contained' shape='rounded'>
          Login With Audius
        </Button>
        <Button
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
    </>
  );
}

function AuthorizeStep() {
  const { close, updateLoginSuccess } = useLoginContext();
  const [params] = useSearchParams();
  const code = params.get("code");
  const state = params.get("state");

  const navigate = useNavigate();
  const authService = useAuthContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["token", code, state],
    queryFn: async () => {
      return await authService.authorize(code, state);
    },
  });

  const status = isLoading ? "loading" : data?.success === true ? "success" : "error";

  useEffect(() => {
    if (isLoading) return;
    if (status !== "success") return;
    updateLoginSuccess(true);
    navigate("/undiscovered");
  }, [isLoading, data]);

  return (
    <div className='flex flex-col gap-4 items-center w-full'>
      <p className='text-center'>
        {status === "loading"
          ? "Signing in. Please wait..."
          : status !== "success"
            ? "Authorization failed. Please try again."
            : null}
      </p>
      {status !== "success" && status !== "loading" ? (
        <div className='flex flex-col w-full gap-2'>
          <Button fullWidth shape='rounded' onClick={async () => await refetch()}>
            Retry
          </Button>
          <Button fullWidth shape='rounded' variant='ghost' onClick={close}>
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
}
