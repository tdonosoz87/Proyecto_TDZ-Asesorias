import React, { useState } from 'react';
import LoginPage from '../Auth/LoginPage'; // Sin llaves {}

export const MaintenancePage = ({ onLoginSuccess }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ marginBottom: '5px' }}>Plataforma Web</h1>
        <span style={styles.statusBadge}>En Mantenimiento</span>
      </header>

      <main style={styles.mainContent}>
        <h2>Estamos construyendo algo genial</h2>
        <p style={{ color: '#666', lineHeight: '1.5' }}>
          Esta plataforma se encuentra actualmente en desarrollo e integracion de modulos.
        </p>
        
        <button 
          style={styles.loginTriggerBtn} 
          onClick={() => setShowLoginModal(true)}
        >
          Acceso Administrador / Usuarios
        </button>
      </main>

      {/* Modal flotante */}
      {showLoginModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              style={styles.closeBtn} 
              onClick={() => setShowLoginModal(false)}
            >
              ✕
            </button>
            <LoginPage onLoginSuccess={onLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f6f8', textAlign: 'center', padding: '20px' },
  header: { marginBottom: '20px' },
  statusBadge: { backgroundColor: '#e74c3c', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' },
  mainContent: { maxWidth: '480px', backgroundColor: '#fff', padding: '35px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  loginTriggerBtn: { marginTop: '20px', padding: '10px 18px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', position: 'relative', width: '90%', maxWidth: '380px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#888' }
};

export default MaintenancePage;