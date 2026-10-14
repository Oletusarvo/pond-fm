import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { useAuthContext } from "../providers/auth-provider";
import { createProvider } from "../../../utils/create-provider";
import { ArrowRight, Lock, LockOpen, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "../../../components/spinner";
import { useQuery } from "@tanstack/react-query";

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
    <div className='flex w-full flex-col gap-6'>
      <div className='flex w-full justify-center'>
        <div className='flex h-16 w-16 grow-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700'>
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
      <div className='mx-auto max-w-xl text-center'>
        <h2 className='text-xl font-bold text-slate-900'>Continue with Audius</h2>
        <p className='mt-2 text-sm leading-6 text-slate-600'>
          Sign in securely on Audius. Amphitune never sees or stores your Audius password.
        </p>
        <Link
          to='https://audius.co/signup/create-email'
          className='mt-3 inline-flex text-sm font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
        >
          New to Audius? Create an account
        </Link>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <button
          type='button'
          onClick={login}
          className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-95'
        >
          Continue to Audius
          <ArrowRight className='h-4 w-4' />
        </button>
        <button
          type='button'
          onClick={close}
          className='min-h-11 w-full active:scale-95 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
        >
          Cancel
        </button>
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
    <div className='flex w-full flex-col items-center gap-4'>
      <p className='text-center text-sm leading-6 text-slate-600'>
        {status === "loading"
          ? "Signing in. Please wait..."
          : status !== "success"
            ? "Authorization failed. Please try again."
            : null}
      </p>
      {status !== "success" && status !== "loading" ? (
        <div className='flex w-full flex-col gap-2'>
          <button
            type='button'
            onClick={async () => await refetch()}
            className='inline-flex min-h-12 active:scale-95 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
          >
            <RotateCcw className='h-4 w-4' />
            Retry
          </button>
          <button
            type='button'
            onClick={close}
            className='min-h-11 w-full active:scale-95 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
          >
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  );
}
