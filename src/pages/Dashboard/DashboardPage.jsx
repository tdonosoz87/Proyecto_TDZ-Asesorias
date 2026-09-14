import React from 'react';

export const DashboardPage = ({ onLogout }) => {
  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', pb: '10px' }}>
        <h2>Módulo Principal / Dashboard</h2>
        <button 
          onClick={onLogout} 
          style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar Sesion
        </button>
      </header>

      <main style={{ marginTop: '20px' }}>
        <h3>Bienvenido a tu plataforma modular</h3>
        <p>Aqui se listaran tus proyectos y modulos personales una vez autenticado.</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '200px' }}>
            <h4>Modulo A</h4>
            <p style={{ fontSize: '12px', color: '#666' }}>Proyecto personal 1</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '200px' }}>
            <h4>Modulo B</h4>
            <p style={{ fontSize: '12px', color: '#666' }}>Proyecto personal 2</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;