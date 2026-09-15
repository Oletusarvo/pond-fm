import { Link } from "react-router-dom";
import { FaIconLink } from "./fa-icon-link";
import { Link2 } from "lucide-react";

const urlFaCodes = {
  "soundcloud.com": "fa-soundcloud",
  "bandcamp.com": "fa-bandcamp",
  "hearthis.at": "fa-hearthis",
  "instagram.com": "fa-instagram",
};

export function FaBrandIconLink({
  to,
  ...props
}: React.ComponentProps<typeof Link>) {
  const urlObject = new URL(to as string);
  const domain = urlObject.hostname.split(".").slice(1).join(".");
  const faCode = urlFaCodes[domain];
  const content = domain.split(".").at(0);
  return (
    <FaIconLink {...props} faCode={faCode} to={urlObject.toString()}>
      {capitalize(content)}
    </FaIconLink>
  );
}

function capitalize(str: string) {
  const [firstLetter, ...rest] = str;
  return [firstLetter.toUpperCase(), ...rest].join("");
}
