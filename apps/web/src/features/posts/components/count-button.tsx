import { useMemo } from "react";
import { useTrackContext } from "../providers/post-provider";
import { Button } from "../../../components/button";

/**Renders a button with a counter beside it. */
export function CountButton({
  icon: Icon,
  value,
  ...props
}: { value: number } & Pick<
  React.ComponentProps<typeof Button>,
  "onClick" | "disabled" | "color" | "icon"
>) {
  const convertedCount = useMemo(() => {
    const thousand = 1e3;
    const million = 1e6;
    const rawCount =
      value >= thousand ? value / thousand : value >= million ? value / million : value;
    const roundedCount = Math.round(rawCount * 100) / 100;
    const postFix = value >= thousand ? "k" : value >= million ? "m" : "";
    return `${roundedCount.toLocaleString("fi")}${postFix}`;
  }, [value]);

  return (
    <Button {...props} variant='text'>
      <div className='flex gap-2 items-center text-sm'>
        <Icon size='1rem' className='text-primary text-sm' />
        <span>{convertedCount}</span>
      </div>
    </Button>
  );
}
