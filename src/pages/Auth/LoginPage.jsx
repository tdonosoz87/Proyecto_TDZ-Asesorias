import React, { useState } from 'react';
import { signIn, confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';
import { logAccessEvent } from '../../services/auditService';

export const LoginPage = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [newPassword, setNewPassword] = useState('');
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  // Función para registrar el evento de acceso en DynamoDB
  const recordAudit = async (userEmail) => {
    try {
      const session = await fetchAuthSession();
      const sub = session.tokens?.idToken?.payload?.sub || userEmail;
      await logAccessEvent(sub, userEmail);
    } catch (e) {
      console.error('No se pudo obtener el ID del usuario para el log', e);
    }
  };

  const handleLoginClick = async () => {
    if (!credentials.email || !credentials.password) {
      setErrorMessage('Por favor ingresa correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      if (isSignedIn) {
        await recordAudit(credentials.email);
        if (onLoginSuccess) onLoginSuccess();
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setNeedsNewPassword(true);
      }
    } catch (error) {
      console.error('Error al iniciar sesion:', error);
      setErrorMessage(error.message || 'Error al conectar con el servicio de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (!newPassword) {
      setErrorMessage('Ingresa la nueva contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { isSignedIn } = await confirmSignIn({ challengeResponse: newPassword });
      if (isSignedIn) {
        await recordAudit(credentials.email);
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (error) {
      console.error('Error al confirmar contraseña:', error);
      setErrorMessage(error.message || 'Error al actualizar contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'left', color: '#333' }}>
      <h3 style={{ marginTop: 0 }}>
        {needsNewPassword ? 'Establecer Nueva Contraseña' : 'Acceso a la Plataforma'}
      </h3>
      
      {errorMessage && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
          {errorMessage}
        </div>
      )}

      {!needsNewPassword ? (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Correo Electronico:</label>
            <input 
              type="email" 
              name="email" 
              value={credentials.email} 
              onChange={handleChange} 
              disabled={loading}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Contrasena:</label>
            <input 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              disabled={loading}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button 
            type="button" 
            onClick={handleLoginClick}
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: loading ? '#95a5a6' : '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Verificando con AWS...' : 'Ingresar'}
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: '#555' }}>Es tu primer inicio de sesión. Por favor ingresa una nueva contraseña definitiva:</p>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Nueva Contraseña:</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              disabled={loading}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button 
            type="button" 
            onClick={handleSetNewPassword}
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: loading ? '#95a5a6' : '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Guardando...' : 'Cambiar Contraseña e Ingresar'}
          </button>
        </>
      )}
    </div>
  );
};

export default LoginPage;