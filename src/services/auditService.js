import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { fetchAuthSession } from 'aws-amplify/auth';

const TABLE_NAME = 'tdz_access_logs';

// Función auxiliar para obtener el cliente autenticado de DynamoDB
const getAuthenticatedDocClient = async () => {
  const session = await fetchAuthSession();
  const credentials = session.credentials;

  if (!credentials) {
    throw new Error('No se obtuvieron credenciales temporales de AWS Cognito.');
  }

  const client = new DynamoDBClient({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  });

  return DynamoDBDocumentClient.from(client);
};

// 1. Guardar evento de acceso
export const logAccessEvent = async (userId, userEmail) => {
  try {
    const docClient = await getAuthenticatedDocClient();

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId: userId,
        loginTimestamp: new Date().toISOString(),
        email: userEmail,
        userAgent: navigator.userAgent,
        status: 'SUCCESSFUL_LOGIN',
      },
    };

    await docClient.send(new PutCommand(params));
    console.log('Evento de auditoria registrado exitosamente en DynamoDB.');
  } catch (error) {
    console.error('Error al registrar auditoria en DynamoDB:', error);
  }
};

// 2. Obtener historial de auditoría
export const getAuditLogs = async () => {
  try {
    const docClient = await getAuthenticatedDocClient();

    const command = new ScanCommand({
      TableName: TABLE_NAME
    });

    const response = await docClient.send(command);

    // Con DocumentClient los objetos ya vienen desempaquetados de forma directa (sin .S o .N)
    return (response.Items || []).map(item => ({
      id: item.userId,
      email: item.email,
      status: item.status,
      timestamp: item.loginTimestamp
    }));
  } catch (error) {
    console.error('Error al obtener registros de auditoria:', error);
    throw error;
  }
};