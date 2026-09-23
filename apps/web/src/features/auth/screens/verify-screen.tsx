import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { useAction } from "../../../hooks/use-action";
import { api } from "../../../utils/api/api";
import { ErrorMessage, SuccessMessage } from "../../../components/helper-message";
import { useEffect } from "react";
import { Button } from "../../../components/button";
import { serviceError } from "@pondfm/app-shared";

export function VerifyScreen() {
  return (
    <Modal title='Verifying Email'>
      <ModalContent />
    </Modal>
  );
}

function ModalContent() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { action, status, loading, error } = useAction({
    fn: async () => api.auth.verifyUser(token),
    onError: (res) => res.error as string,
  });

  useEffect(() => {
    action();
  }, []);

  return (
    <div className='flex flex-col w-full gap-4'>
      {status === "auth:user-quota-exceeded" ? (
        <ErrorMessage>Unfortunately we do not accept more users at this time.</ErrorMessage>
      ) : status === "success" ? (
        <div className='flex w-full flex-col gap-2'>
          <SuccessMessage>Your email has been verified!</SuccessMessage>
          <Button
            paddingEnabled
            variant='contained'
            fullWidth
            shape='rounded'
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      ) : loading ? (
        <p>Verifying your email. Please wait...</p>
      ) : error ? (
        <ErrorMessage>Something went wrong!</ErrorMessage>
      ) : null}
      {status === "error" ? (
        <div className='flex w-full flex-col gap-2'>
          <Button
            fullWidth
            paddingEnabled
            shape='rounded'
            variant='contained'
            onClick={async () => action()}
          >
            Retry
          </Button>
          <Button
            fullWidth
            shape='rounded'
            paddingEnabled
            variant='ghost'
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </div>
      ) : status === "auth:user-quota-exceeded" ? (
        <Button
          fullWidth
          shape='rounded'
          paddingEnabled
          variant='contained'
          onClick={() => navigate("/")}
        >
          Cancel
        </Button>
      ) : null}
    </div>
  );
}
