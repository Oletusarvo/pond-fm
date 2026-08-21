import { useRef, useState } from "react";
import { useSubmit } from "../../../hooks/use-submit";
import { apiService } from "../../../utils/api/api-service";
import { useAuthContext } from "../../auth/providers/auth-provider";

export function useUploadTrack({ fetchFn, ...props }: Parameters<typeof useSubmit>[0]) {
  const authService = useAuthContext();
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('uploading');
  const fileSizeRef = useRef<number>(0);
  const { submit, loading, status } = useSubmit({
    ...props,
    fetchFn: async (payload) => {
      const file = payload.get('file') as unknown as File;
      fileSizeRef.current = file.size;
      const res = await fetchFn(payload);
      if (!res.ok) {
        return res;
      }
      const uploadSession = await res.json();
      try {
        await apiService.uploadToUrl({
          method: 'PUT',
          url: uploadSession.uploadUrl,
          file,
          onProgress: progress => setProgress(progress)
        });
      } catch (error) {
        return new Response(null, { status: 500 });
      }

      setProgressStatus('processing');

      return await apiService.completeUpload(uploadSession.code);
    },
    onSuccess: async (res) => {
      const newStorageConsumed = Number(authService.session?.user.subscription.storage_quota_consumed) + fileSizeRef.current;
      await authService.refreshSession({
        user: {
          subscription: {
            storage_quota_consumed: newStorageConsumed,
          }
        }
      });
      return await props.onSuccess?.(res);
    },
    onError: async res => {
      if (res.status === 409) {
        const err = await res.json();
        return err.error;
      }
    }
  });

  return { submit, loading, status, progress, progressStatus };
}