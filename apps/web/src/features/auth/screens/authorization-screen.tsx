import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Spinner } from '../../../components/spinner';
import { apiService } from '../../../utils/api-service';
import { useEffect } from 'react';

export function AuthorizationScreen() {
  const { code } = useParams();
  const navigate = useNavigate();
  const authorize = async () => {
    try {
      const res = await apiService.authorize(code);
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
    authorize();
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
