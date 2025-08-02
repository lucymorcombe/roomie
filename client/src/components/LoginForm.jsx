import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionContext';

function LoginForm() {
  console.log('useSession()', useSession());

  const { setSession } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      setSession({ ...data, loggedIn: true });
      navigate(`/profile/${data.userId}`);
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email address
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm
