import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SimpleRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(email, password, name, 'teacher');
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Simple Registration</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nom:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
        >
          {isLoading ? 'Création...' : 'Créer le compte'}
        </button>
      </form>
    </div>
  );
};

export default SimpleRegister;
