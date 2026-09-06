import { useRef, useState } from "react";
import { useSubmit } from "../../../hooks/use-submit";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { Api, api } from "../../../utils/api/api";
import { TApiResponse } from "../../../utils/api/types";
import { TTrack } from "@pondfm/app-shared";

type UseUploadTrackProps = Parameters<typeof useSubmit>[0] & {
  data: {
    track: Pick<TTrack, "genre" | "moods">;
  };
};

/**@deprecated */
export function useUploadTrack({ data, ...props }: UseUploadTrackProps) {
  const authService = useAuthContext();
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("uploading");
  const fileSizeRef = useRef<number>(0);
  const { submit, loading, status } = useSubmit({
    ...props,
    fetchFn: async (payload) => {
      const file = payload.get("file") as unknown as File;

      fileSizeRef.current = file.size;
      const res = await api.tracks.create.requestUploadUrl({
        upload: {
          mimeType: file.type,
          size: file.size,
          filename: file.name,
        },
        track: {
          title: payload.get("title") as string,
          moods: data.track.moods,
          genre: data.track.genre,
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
    onSuccess: async (res) => {
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
      return await props.onSuccess?.(res);
    },
    onError: async (res) => {
      if (res.status === 409) {
        return res.error as string;
      }
    },
  });

  return { submit, loading, status, progress, progressStatus };
}
