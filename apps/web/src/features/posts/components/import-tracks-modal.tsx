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
    <div className='flex w-full flex-col gap-3'>
      <div className='mb-2 flex w-full items-center gap-4 rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-5'>
        <img
          src='/assets/guitar-frawg.webp'
          alt='Amphitune frog playing a guitar'
          className='h-16 w-16 shrink-0 rounded-2xl border border-white object-cover shadow-sm sm:h-20 sm:w-20'
        />
        <div className='min-w-0'>
          <h2 className='text-lg font-bold text-slate-900 sm:text-xl'>Bring your music over</h2>
          <p className='mt-1 text-sm leading-5 text-slate-600'>
            Import your Audius catalogue or upload a new track on Audius.
          </p>
        </div>
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
      className='group flex w-full cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-start text-slate-900 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50'
    >
      <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100'>
        {icon}
      </span>
      <div className='flex min-w-0 flex-col gap-1'>
        <h3 className='font-bold text-slate-900'>{title}</h3>
        <div className='text-sm leading-5 text-slate-600'>
          {React.isValidElement(description) ? description : <p>{description}</p>}
        </div>
      </div>
    </button>
  );
}
