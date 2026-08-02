import { Tag } from "./tag";

type TagInputProps = {
  onChange?: (tag: string) => void;
  values?: string[];
}
export function TagInput({onChange, values}){
  return (
    <div className="flex w-full items-center gap-2">
      <Tag
    </div>
  )
}