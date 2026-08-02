import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Spinner } from '../../../components/spinner';
import { useEffect } from 'react';
import { useAppContext } from '../../../providers/app-provider';
import { useAuthContext } from '../providers/auth-provider';
import { useStatus } from '../../../hooks/use-status';
import { Button } from '../../../components/button';

export function AuthorizationScreen() {
  const { status, setStatus } = useStatus();
  const { code } = useParams();
  const navigate = useNavigate();
  const authService = useAuthContext();
  const onAuthorize = async () => {
    return await authService.authorize(code);
  };

  useEffect(() => {
    let t;
    setStatus('loading');
    onAuthorize()
      .then(res => {
        if (res.ok) {
          setStatus('success');
          t = setTimeout(() => {
            navigate('/new');
          }, 1500);
        } else {
          setStatus('error');
        }
      })
      .catch(err => {
        console.log(err.message);
        setStatus('error');
      });

    return () => {
      clearTimeout(t);
    };
  }, []);

  return (
    <Modal
      title='Authorization'
      onClose={null}>
      <div className='flex w-full flex-col gap-4 items-center'>
        {status === 'loading' ? (
          <>
            <Spinner />
            <p className='text-slate-500'>Please wait while we authorize you...</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className='flex flex-col items-center'>
              <h2 className='text-xl font-semibold'>Authorization succeeded!</h2>
              <p className='text-slate-500'>Please wait while we redirect you...</p>
            </div>
          </>
        ) : (
          <>
            <div className='flex flex-col items-center'>
              <h2 className='text-xl font-semibold'>Authorization failed!</h2>
              <p className='text-slate-500'>Something went wrong!</p>
            </div>

            <Link to='/login'>
              <Button
                paddingEnabled
                variant='outlined'
                shape='rounded'>
                Request a new login link
              </Button>
            </Link>
          </>
        )}
      </div>
    </Modal>
  );
}
