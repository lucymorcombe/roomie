import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionContext';

function RegisterForm() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', username: '', display_name: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();

    if (data.success) {
      setSession({ ...data, loggedIn: true });
      navigate(`/profile/${data.userId}`);
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="display_name" placeholder="Display Name" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm
