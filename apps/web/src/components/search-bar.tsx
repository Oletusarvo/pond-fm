import { Input } from './input';

type SearchBarProps = {
  onSearch: (search: string) => void;
};
export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <Input
      type='search'
      onChange={e => onSearch(e.target.value)}
    />
  );
}
