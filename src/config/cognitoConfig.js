import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_AWS_CLIENT_ID,
        identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
        signUpVerificationMethod: 'code',
      }
    }
  });
};