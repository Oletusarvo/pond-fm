import { Pencil, Settings } from "lucide-react";
import { Button } from "../../../components/button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePostContext } from "../providers/post-provider";

export function SettingsButton() {
  const authService = useAuthContext();
  const postService = usePostContext();
  return authService.session?.user.id === postService.post?.track.author.id ? <Button onClick={() => postService.toggleEdit(true)} type="button" variant='ghost' shape='circle'><Pencil size="1rem" /></Button> : null
}