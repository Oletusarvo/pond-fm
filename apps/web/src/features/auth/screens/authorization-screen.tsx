import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Spinner } from '../../../components/spinner';
import { useEffect } from 'react';
import { useAuthContext } from '../providers/auth-provider';

export function AuthorizationScreen() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { authorize } = useAuthContext();
  const onAuthorize = async () => {
    try {
      const res = await authorize(code);
      if (res.ok) {
        navigate('/discover');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    onAuthorize();
  }, []);

  return (
    <Modal
      title='Authorizing'
      onClose={null}>
      <div className='flex w-full flex-col gap-2'>
        <Spinner />
        <p>Please wait while we authorize you...</p>
      </div>
    </Modal>
  );
}
