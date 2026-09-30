import { useQuery } from "@tanstack/react-query";
import { audiusSdk } from "../../../utils/audius.config";
import { useAuthContext } from "../../auth/providers/auth-provider";

export function useAudiusTrack(id: string, enabled: boolean = true) {
  const { data, isLoading } = useQuery({
    queryKey: ["audius-track", id],
    queryFn: async () => {
      const sdk = audiusSdk;
      return await sdk.tracks.get({
        trackId: id,
      });
    },
    enabled,
  });
  return { data, isLoading };
}
