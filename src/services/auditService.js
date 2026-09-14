import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { fetchAuthSession } from 'aws-amplify/auth';
///
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: "CLAVE_DE_ACCESO_TEMPORAL_O_CONFIGURADA", // O por credenciales de Cognito Identity Pool
    secretAccessKey: "SECRET_KEY_TEMPORAL"
  }
});

export const getAuditLogs = async () => {
  try {
    const command = new ScanCommand({
      TableName: "AuditLogs"
    });
    const response = await client.send(command);
    
    // Mapear el formato interno de DynamoDB a un array JS limpio
    return (response.Items || []).map(item => ({
      id: item.id?.S,
      userId: item.userId?.S,
      action: item.action?.S,
      timestamp: item.timestamp?.S
    }));
  } catch (error) {
    console.error("Error al obtener registros de auditoria:", error);
    throw error;
  }
};
///
export const logAccessEvent = async (userId, userEmail) => {
  try {
    // Obtener las credenciales temporales de AWS desde la sesion activa de Cognito
    const session = await fetchAuthSession();
    const credentials = session.credentials;

    if (!credentials) {
      console.warn('No se obtuvieron credenciales temporales de AWS.');
      return;
    }

    // Instanciar el cliente pasando las credenciales autorizadas
    const client = new DynamoDBClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      },
    });

    const docClient = DynamoDBDocumentClient.from(client);

    const params = {
      TableName: 'tdz_access_logs',
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