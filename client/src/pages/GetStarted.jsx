import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function GetStarted() {
  const [activeTab, setActiveTab] = useState('login'); 

  return (
    <div className="get-started-container"> {/* ✅ */}
      <div className="tab-buttons" style={{ display: 'flex', marginBottom: '1rem' }}> {/* ✅ */}
        <button
          onClick={() => setActiveTab('login')}
          style={{
            flex: 1,
            padding: '0.5rem',
            fontWeight: activeTab === 'login' ? 'bold' : 'normal',
          }}
          className={activeTab === 'login' ? 'active' : ''} // ✅
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            flex: 1,
            padding: '0.5rem',
            fontWeight: activeTab === 'register' ? 'bold' : 'normal',
          }}
          className={activeTab === 'register' ? 'active' : ''} // ✅
        >
          Register
        </button>
      </div>

      {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

export default GetStarted;
