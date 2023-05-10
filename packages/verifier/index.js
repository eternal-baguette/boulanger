import {Octokit} from 'octokit';
import {createAppAuth} from '@octokit/auth-app';

const authSecrets = {
    appId: process.env.RELEASER_APP_ID,
    privateKey: process.env.RELEASER_PRIVATE_KEY,
    clientId: process.env.RELEASER_CLIENT_ID,
    clientSecret: process.env.RELEASER_CLIENT_SECRET,
    installationId: process.env.RELEASER_INSTALLATION_ID,
  };

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: authSecrets,
  });
  console.log(process.env.DEPLOYED_ENV)
  console.log(process.env.CB_URL)
  await octokit.request(`POST ${new URL(process.env.CB_URL).pathname}`, {
    state: 'approved',
    "environment_name": process.DEPLOYED_ENV,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })