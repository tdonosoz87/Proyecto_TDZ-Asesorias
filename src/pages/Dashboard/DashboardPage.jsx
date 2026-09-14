import React, { useState } from 'react';
import { AuditPanel } from './AuditPanel';

export const DashboardPage = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' o 'audit'

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Módulo Principal / Dashboard</h1>
        <button onClick={onLogout} style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </header>

      {/* Menú de Navegación Interno */}
      <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('modules')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'modules' ? '#3498db' : '#2c3e50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Mis Módulos
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'audit' ? '#3498db' : '#2c3e50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          📋 Registros de Auditoría
        </button>
      </nav>

      {/* Contenido Dinámico según la Pestaña */}
      <main>
        {activeTab === 'modules' ? (
          <div>
            <h3>Bienvenido a tu plataforma modular</h3>
            <p>Aquí se listarán tus proyectos y módulos personales una vez autenticado.</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
                <h4>Módulo A</h4>
                <p>Proyecto personal 1</p>
              </div>
              <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
                <h4>Módulo B</h4>
                <p>Proyecto personal 2</p>
              </div>
            </div>
          </div>
        ) : (
          <AuditPanel />
        )}
      </main>
    </div>
  );
};