import { Pencil, Settings } from "lucide-react";
import { Button } from "../../../components/button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useTrackContext } from "../providers/post-provider";

export function SettingsButton(props) {
  const authService = useAuthContext();
  const postService = useTrackContext();
  return authService.session?.user.id === postService.track?.track.author.id ? (
    <Button {...props} type='button' variant='ghost' shape='circle'>
      <Pencil size='1rem' />
    </Button>
  ) : null;
}
