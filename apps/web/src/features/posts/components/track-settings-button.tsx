import { Pencil, Settings } from "lucide-react";
import { Button } from "../../../components/button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePostContext } from "../providers/post-provider";

export function SettingsButton(props) {
  const authService = useAuthContext();
  const postService = usePostContext();
  return authService.session?.user.id === postService.post?.track.author.id ? <Button {...props} type="button" variant='ghost' shape='circle'><Pencil size="1rem" /></Button> : null
}