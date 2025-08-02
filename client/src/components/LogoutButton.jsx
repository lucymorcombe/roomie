import { useSession } from './SessionContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { setSession } = useSession();
  const navigate = useNavigate();

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setSession({ loggedIn: false });
    navigate('/');
  };

  return <button onClick={logout}>Log Out</button>;
}

export default LogoutButton