import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/user-proivder";
import { Button } from "../../../components/button";

export function FollowerItem({ user, onClick }) {
  return (
    <div onClick={onClick} className="text-sm text-primary font-semibold py-2 cursor-pointer">{user.username}</div>
  );
}