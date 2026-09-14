import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { fetchAuthSession } from 'aws-amplify/auth';

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