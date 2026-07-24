import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Button } from '../../../components/button';
import { useAuthContext } from '../providers/auth-provider';

export function LoginScreen() {
  const navigate = useNavigate();
  const close = () => navigate('/');
  const { requestAuthorization } = useAuthContext();
  const onSubmit = async e => {
    e.preventDefault();

    const credentials = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      username?: string;
    };
    console.log(credentials);
    try {
      await requestAuthorization(credentials);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Modal
      title='Login'
      onClose={close}>
      <form
        className='flex w-full flex-col gap-4'
        onSubmit={onSubmit}>
        <input
          name='username'
          placeholder='Enter your username...'
          className='py-2 px-4 outline-none border border-slate-200 rounded-md'
        />
        <div className='flex flex-col w-full'>
          <input
            name='email'
            placeholder='Enter your email...'
            type='email'
            className='py-2 px-4 outline-none border border-slate-200 rounded-md'
          />
          <span className='text-slate-500 text-sm'>
            We will send you a link into your inbox through which to authenticate. The link is valid
            for 15 minutes.
          </span>
        </div>

        <div className='flex gap-4 w-full'>
          <Button
            type='button'
            onClick={close}
            fullWidth
            paddingEnabled
            variant='outlined'
            shape='rounded'>
            Cancel
          </Button>
          <Button
            type='submit'
            fullWidth
            paddingEnabled
            variant='contained'
            shape='rounded'>
            Login
          </Button>
        </div>
      </form>
    </Modal>
  );
}
