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

  await octokit.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule', {
    owner: process.OWNER,
    repo: process.REPO,
    run_id: process.RUN_ID,
    state: 'approved',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })