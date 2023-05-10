import Fastify from "fastify";
import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { createHmac } from "crypto";

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

// Require the fastify framework and instantiate it
const fastify = Fastify({
  // Set this to true for detailed logging:
  logger: false,
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", async function (req, reply) {
  // Verify the signature
  if (req.body["action"] !== "requested") {
    reply.code(204);
    reply.send();
    return;
  }

  let signature = req.headers["X-Hub-Signature"];
  let hmac = createHmac("sha256", process.env.WEBHOOK_SECRET);
  let calculatedSignature =
    "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");

  if (calculatedSignature !== signature) {
    reply.code(401);
    reply.send();
    return;
  }
  const ref = `${req.body["repository"]["full_name"]}@${req.body["deployment"]["sha"]}`;
  await sendVerificationRequest(ref, req.body["deployment_callback_url"]);
  reply.code(200);
  reply.send();
});


function sendVerificationRequest(refToCheck: string, deploymentCbUrl: string) {
  return octokit.rest.actions.createWorkflowDispatch({
    owner: "eternal-baguette",
    repo: "boulanger",
    workflow_id: "TODO",
    ref: "main",
    inputs: {
      refToCheck,
      deploymentCbUrl,
    },
  });
}

// Run the server and report out to the logs
fastify.listen(
  { host: "0.0.0.0", port: parseInt(process.env.PORT) },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);

