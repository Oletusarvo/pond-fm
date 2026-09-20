import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { useAction } from "../../../hooks/use-action";
import { api } from "../../../utils/api/api";
import { useEffect } from "react";
import { Button } from "../../../components/button";
import { Spinner } from "../../../components/spinner";
import { useAuthContext } from "../providers/auth-provider";
import { TApiSuccessResponse } from "../../../utils/api/types";

export function VerifyEmailUpdateScreen() {
  return (
    <Modal title='Verify Email Update'>
      <ModalContent />
    </Modal>
  );
}

function ModalContent() {
  const [search] = useSearchParams();
  const { refreshSession } = useAuthContext();
  const navigate = useNavigate();
  const token = search.get("token");
  const { action, loading, status } = useAction({
    fn: async () => api.auth.verifyEmailUpdate(token),
    onSuccess: async (res: TApiSuccessResponse<{ new_email: string }>) => {
      await refreshSession({
        user: {
          email: res.data.new_email,
        },
      });
    },
  });

  useEffect(() => {
    action();
  }, []);

  const LoadingContent = () => {
    return (
      <>
        <p>Please wait while we verify your new email...</p>
        <Spinner />
      </>
    );
  };

  const ErrorContent = () => {
    return (
      <>
        <p>Something went wrong!</p>
        <Button fullWidth onClick={action}>
          Try Again
        </Button>
      </>
    );
  };

  const SuccessContent = () => {
    return (
      <>
        <p>Your email has been updated!</p>
        <Button fullWidth onClick={() => navigate("/")}>
          Dismiss
        </Button>
      </>
    );
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      {status === "loading" ? (
        <LoadingContent />
      ) : status === "error" ? (
        <ErrorContent />
      ) : (
        <SuccessContent />
      )}
    </div>
  );
}
