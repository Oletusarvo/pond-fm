import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../../../components/modal";
import { useRef } from "react";
import { useAuthContext } from "../providers/auth-provider";
import { Button, LoaderButton } from "../../../components/button";
import { Form } from "../../../components/form";
import { Input } from "../../../components/input";
import { useSubmit } from "../../../hooks/use-submit";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/helper-message";

export function AuthorizationScreen() {
  const navigate = useNavigate();
  const onClose = () => navigate("/");
  return (
    <Modal title='Authorization' onClose={onClose}>
      <ModalContent onClose={onClose} />
    </Modal>
  );
}

function ModalContent({ onClose }) {
  const [params] = useSearchParams();
  const code = params.get("code");
  const navigate = useNavigate();
  const authService = useAuthContext();
  const formRef = useRef<HTMLFormElement>(null);
  const { submit, loading, status } = useSubmit({
    fetchFn: async (payload) => {
      const data = Object.fromEntries(payload) as { code: string };
      return await authService.authorize(data.code);
    },
    onSuccess: () => {
      navigate("/new");
    },
  });

  const buttonsDisabled = loading || status === "success";
  return (
    <div className='flex w-full flex-col gap-4'>
      <Form onSubmit={submit} ref={formRef}>
        <p>To sign in, please submit the code we sent you.</p>
        <Form.Group label='Code'>
          <Input name='code' type='text' required defaultValue={code} />
        </Form.Group>
        <div className='flex gap-2 w-full'>
          <Button
            disabled={buttonsDisabled}
            variant='outlined'
            fullWidth
            paddingEnabled
            shape='rounded'
            onClick={onClose}
          >
            Cancel
          </Button>
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
    </div>
  );
}
