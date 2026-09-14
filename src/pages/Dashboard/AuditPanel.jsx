import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../../services/auditService';

export const AuditPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2>📋 Registros de Auditoría (DynamoDB)</h2>
      <button onClick={fetchLogs} style={{ marginBottom: '15px', padding: '8px 16px' }}>
        🔄 Refrescar
      </button>

      {loading ? (
        <p>Cargando registros desde AWS...</p>
      ) : (
        <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
  <thead>
    <tr style={{ background: '#2c3e50' }}>
      <th style={{ padding: '10px' }}>ID de Usuario</th>
      <th style={{ padding: '10px' }}>Email</th>
      <th style={{ padding: '10px' }}>Estado / Acción</th>
      <th style={{ padding: '10px' }}>Fecha / Hora</th>
    </tr>
  </thead>
  <tbody>
    {logs.map(log => (
      <tr key={log.timestamp}>
        <td style={{ padding: '8px' }}>{log.id}</td>
        <td style={{ padding: '8px' }}>{log.email}</td>
        <td style={{ padding: '8px' }}>{log.status}</td>
        <td style={{ padding: '8px' }}>{new Date(log.timestamp).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>
      )}
    </div>
  );
};