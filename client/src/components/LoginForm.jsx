import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionContext';

function LoginForm() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log('login response data:', data);

      if (data.success) {
        setSession(prev => ({
          ...prev,
          loading: false,
          loggedIn: true,
          userId: data.userId,
          // add other user info here if your API returns it
        }));
        navigate(`/profile/${data.userId}`);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
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
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
