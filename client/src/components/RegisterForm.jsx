import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionContext';

function RegisterForm() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one capital letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordError(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(form.password);
    if (error) {
      setPasswordError(error);
      return;
    }
    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    const data = await res.json();

    if (data.success) {
      setSession({ ...data, loggedIn: true });
      navigate(`/profile-setup`);
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name
        <input
          name="first_name"
          type="text"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
        />
      </label>

      <label>
        Last name
        <input
          name="last_name"
          type="text"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
        />
      </label>

      <label>
        Date of birth
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
        />
      </label>

      <label>
        Email address
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {passwordError && (
          <span className="passwordError">
            {passwordError}
          </span>
        )}
      </label>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;