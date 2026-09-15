import { Form } from "../../../components/form";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../../components/helper-message";
import { Input } from "../../../components/input";
import { Modal } from "../../../components/modal";
import React, { useRef, useState } from "react";
import { useSubmit } from "../../../hooks/use-submit";

import { useQueryClient } from "@tanstack/react-query";
import { Button, LoaderButton } from "../../../components/button";
import { ProgressBar } from "./progress-bar";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useToggleContext } from "../../../providers/toggle-provider";
import { GenreSelector } from "./track-modal-selector";
import { MoodSelector } from "./track-modal-selector";
import { api } from "../../../utils/api/api";
import { TApiResponse } from "../../../utils/api/types";
import { createProvider } from "../../../utils/create-provider";
import { File } from "lucide-react";
import { useAction } from "../../../hooks/use-action";

type UploadTrackModalStep = "upload-file" | "fill-details";

const [
  /**Provides global logic and methods for the upload modal.
   * @todo
   */
  UploadTrackModalProvider,
  useUploadTrackContext,
] = createProvider({
  contextName: "UploadTrackModalContext",
  hook: () => {
    const [step, setStep] = useState<UploadTrackModalStep>("upload-file");

    const updateStep = (newStep: UploadTrackModalStep) => {
      setStep(newStep);
    };
    return {
      step,
      updateStep,
    };
  },
});

/**Renders the form form uploading a new track. */
export const UploadTrackModal = React.memo(function () {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);

  return (
    <Modal title='Upload' onClose={onClose}>
      <UploadTrackModalProvider>
        <ModalContent onClose={onClose} />
      </UploadTrackModalProvider>
    </Modal>
  );
});

/**
 * Renders a form containing the file input.
 * @todo
 */
function UploadFileStep() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const selectFile = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const onFileSelected = () => {};

  return (
    <form className='flex w-full items-center justify-center'>
      <button
        className='w-full h-full flex items-center justify-center'
        onClick={selectFile}
      >
        <File />
      </button>
      <input
        onChange={() => {
          formRef.current?.submit();
        }}
        ref={inputRef}
        type='file'
        name='file'
        hidden
        accept='audio/mpeg,audio/wav'
      />
    </form>
  );
}

/**Renders the content of the modal. Done as a separate component to stop re-renders of the modal when things change. */
function ModalContent({ onClose }) {
  const genreRef = useRef<string | null>(null);
  const moodsRef = useRef<string[]>([]);
  const queryClient = useQueryClient();
  const authService = useAuthContext();
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("uploading");
  const fileSizeRef = useRef<number>(0);

  const {
    submit: uploadTrack,
    loading: uploadLoading,
    status: uploadStatus,
  } = useSubmit({
    fetchFn: async (payload) => {
      const data = Object.fromEntries(payload) as any;
      data.moods = moodsRef.current;
      data.genre = genreRef.current;
      const { file, ...rest } = data;

      fileSizeRef.current = file.size;
      const res = await api.tracks.create.requestUploadUrl({
        upload: {
          filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
        },
        track: {
          title: rest.title,
          moods: rest.moods,
          genre: rest.genre,
        },
      });
      if (!res.success) {
        return res;
      }
      const uploadSession = res.data;
      try {
        await api.tracks.create.upload({
          method: "PUT",
          url: uploadSession.uploadUrl,
          file,
          onProgress: (progress) => setProgress(progress),
        });
      } catch (error) {
        return {
          status: 500,
          success: false,
        } as TApiResponse;
      }

      setProgressStatus("processing");
      return await api.tracks.create.complete(uploadSession.code);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      const newStorageConsumed =
        Number(authService.session?.user.subscription.storage_quota_consumed) +
        fileSizeRef.current;
      await authService.refreshSession({
        user: {
          subscription: {
            storage_quota_consumed: newStorageConsumed,
          },
        },
      });
      setTimeout(() => onClose(), 1500);
    },
    onError: async (res) => {
      if (res.status === 409) {
        return res.error as string;
      }
    },
  });

  const { storage_quota_bytes, storage_quota_consumed } = authService.session
    ?.user.subscription || {
    storage_quota_bytes: 0,
    storage_quota_consumed: 0,
  };
  const storageQuotaConsumed =
    (Number(storage_quota_consumed) / Number(storage_quota_bytes)) * 100;
  const loading = uploadLoading;
  const status = uploadStatus;
  const submit = uploadTrack;

  return (
    <div className='flex flex-col w-full gap-8 text-black'>
      <div className='flex flex-col w-full'>
        <h2 className='font-semibold text-lg'>Upload Your Track</h2>
        <p className='text-slate-500'>
          We currently support mp3 and wav uploads. Free plans are recommended
          to upload mp3 files to conserve their storage quota.
        </p>
      </div>

      <div className='flex flex-col w-full'>
        <ProgressBar progress={progress} status={progressStatus as any} />
        <div className='flex gap-4'>
          <small>Upload progress {progress.toFixed(2) || 0}%</small>
          {progressStatus === "processing" ? (
            <small>Processing...</small>
          ) : null}
        </div>
      </div>

      <div className='flex flex-col w-full'>
        <ProgressBar progress={storageQuotaConsumed} status={"uploading"} />
        <small>Quota consumed {storageQuotaConsumed.toFixed(2)}%</small>
      </div>
      <Form onSubmit={submit}>
        <Form.Group label='File'>
          <Input required type='file' name='file' />
        </Form.Group>
        <Form.Group label='Title'>
          <Input
            required
            type='text'
            name='title'
            placeholder='Type a title for the track...'
          />
        </Form.Group>

        <Form.Group label='Main Genre'>
          <GenreSelector onChange={(genre) => (genreRef.current = genre)} />
        </Form.Group>
        <Form.Group label='Style (Max 3)'>
          <MoodSelector onChange={(moods) => (moodsRef.current = moods)} />
        </Form.Group>
        <div className='flex flex-col w-full gap-2'>
          <SubmitButton
            fullWidth
            paddingEnabled
            shape='rounded'
            variant='contained'
            loading={loading}
            disabled={status === "success" || loading}
          >
            Upload
          </SubmitButton>
          <Button
            shape='rounded'
            variant='ghost'
            color='primary'
            onClick={onClose}
            fullWidth
            paddingEnabled
          >
            Cancel
          </Button>
        </div>
        {status === "upload:quota-exceeded" ? (
          <ErrorMessage>
            You have reached your upload quota. Please upgrade to pro to
            continue uploading.
          </ErrorMessage>
        ) : status === "error" ? (
          <ErrorMessage>Something went wrong!</ErrorMessage>
        ) : status === "success" ? (
          <SuccessMessage>Track upload successfull!</SuccessMessage>
        ) : null}
      </Form>
    </div>
  );
}

const SubmitButton = React.memo(function ({
  children,
  ...props
}: React.ComponentProps<typeof LoaderButton>) {
  return (
    <LoaderButton {...props} type='submit'>
      {children}
    </LoaderButton>
  );
});
