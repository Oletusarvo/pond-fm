import { Link } from "react-router-dom";
import { Button, LoaderButton } from "../../../components/button";
import { Modal } from "../../../components/modal";
import { useAction } from "../../../hooks/use-action";
import { useToggleContext } from "../../../providers/toggle-provider";
import { api } from "../../../utils/api/api";
import { ReactNode } from "react";
import { ArrowDownCircle, ArrowUpCircle, ExternalLink } from "lucide-react";
import { useInvalidateFeeds } from "../hooks/use-invalidate-feed";
import { Spinner } from "../../../components/spinner";
import { debounce } from "../../../utils/debounce";
import React from "react";
import { ErrorMessage, HelperMessage, SuccessMessage } from "../../../components/helper-message";
import { PassProps } from "../../../components/pass-props";

/**Renders the modal for importing or uploading tracks. */
export function ImportTracksModal() {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);

  return (
    <Modal title='Import Tracks' onClose={onClose}>
      <Content onClose={onClose} />
    </Modal>
  );
}

function Content({ onClose }) {
  const invalidateFeeds = useInvalidateFeeds();
  const { action, status, loading } = useAction({
    fn: debounce(async () => {
      return await api.tracks.importFromAudius();
    }, 700),
    onSuccess: async () => {
      await invalidateFeeds();
      setTimeout(() => onClose(), 1200);
    },
    onError: (res) => {
      if (res.status === 429) {
        return "rate-limited";
      }
    },
  });

  const upload = () => {
    window.open("https://audius.co/upload", "_blank");
  };
  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='mb-8 w-full'>
        <h2 className='text-xl font-semibold'>Import Tracks</h2>
        <p>Import your entire catalogue from Audius to Amphitune, or upload to Audius. </p>
      </div>
      <MethodButton
        icon={<ArrowDownCircle />}
        disabled={loading || status === "success"}
        onClick={action}
        title='Import All Tracks'
        description={
          <div className='flex flex-col items-start gap-1'>
            <span>Import your entire catalogue from Audius to Amphitune.</span>
            {loading ? (
              <HelperMessage>
                <div className='flex gap-2 items-center'>
                  <Spinner /> <span>Importing tracks. Please wait...</span>
                </div>
              </HelperMessage>
            ) : status === "success" ? (
              <SuccessMessage>
                <span>Import successful!.</span>
              </SuccessMessage>
            ) : status === "rate-limited" ? (
              <ErrorMessage>
                <span>
                  Whoa there! You have been rate limited. Please try again in a few moments.
                </span>
              </ErrorMessage>
            ) : status === "error" ? (
              <ErrorMessage>
                <Spinner /> <span>Track import failed!</span>
              </ErrorMessage>
            ) : null}
          </div>
        }
      />

      <MethodButton
        icon={<ArrowUpCircle />}
        disabled={loading || status === "success"}
        onClick={upload}
        title={
          <div className='flex items-center gap-1'>
            <span>Upload Track</span> <ExternalLink size='1rem' />
          </div>
        }
        description={
          <span>
            Upload a new track. You will be taken to the Audius upload-form. Amphitune does
            currently not automatically synchronize your catalogue; you'll need to manually
            re-import it on this form after you're done.
          </span>
        }
      />
    </div>
  );
}

function MethodButton({
  title,
  description,
  icon,
  ...props
}: Omit<React.ComponentProps<"button">, "title"> & {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <button
      {...props}
      className='rounded-md border border-primary text-primary w-full p-4 cursor-pointer text-start flex gap-4 items-center'
    >
      <div className='flex flex-col'>
        <h3 className='font-semibold'>{title}</h3>
        {React.isValidElement(description) ? description : <p>{description}</p>}
      </div>
    </button>
  );
}
