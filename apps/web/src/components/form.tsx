import { Button, LoaderButton } from './button';

type FormProps = React.ComponentProps<'form'>;

export function Form({ children, ...props }: FormProps) {
  return (
    <form
      {...props}
      className='flex flex-col w-full gap-4'>
      {children}
    </form>
  );
}

type FormGroupProps = React.PropsWithChildren & {
  label: string;
};

Form.Group = function ({ children, label }: FormGroupProps) {
  return (
    <div className='flex flex-col w-full'>
      <label className='text-sm text-slate-500 ml-1'>{label}</label>
      {children}
    </div>
  );
};

type FormControlsProps = {
  cancelText?: string;
  acceptText?: string;
  disabled?: boolean;
  loading?: boolean;
  onCancel: () => void;
};

Form.Controls = function ({
  loading,
  disabled,
  cancelText = 'Cancel',
  acceptText = 'Ok',
  onCancel,
}: FormControlsProps) {
  return (
    <div className='flex gap-2 w-full'>
      <Button
        disabled={disabled}
        onClick={onCancel}
        shape='rounded'
        paddingEnabled
        type='button'
        variant='outlined'
        fullWidth>
        {cancelText}
      </Button>
      <LoaderButton
        loading={loading}
        disabled={disabled}
        shape='rounded'
        paddingEnabled
        type='submit'
        variant='contained'
        fullWidth>
        {acceptText}
      </LoaderButton>
    </div>
  );
};
