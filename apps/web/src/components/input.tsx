type InputProps = React.ComponentProps<'input'>;
export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className='w-full border rounded-md border-slate-200 px-4 py-2 text-slate-500 outline-0'
    />
  );
}
