const { generateKeyPairSync } = require('crypto');
const { spawnSync } = require('child_process');

console.log("Generating new PKCS8 key...");
const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

console.log("Key generated. Setting JWT_PRIVATE_KEY...");

try {
  // Set JWT_PRIVATE_KEY
  const ret = spawnSync('npx', ['convex', 'env', 'set', 'JWT_PRIVATE_KEY', privateKey], {
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  if (ret.status !== 0) {
    console.error("Failed to set JWT_PRIVATE_KEY via CLI. You may need to set it manually in the dashboard.");
    process.exit(1);
  } else {
    console.log("JWT_PRIVATE_KEY set successfully.");
  }
  
  // Set CONVEX_SITE_URL
  // Using the URL the user is currently on
  const siteUrl = "https://lazy-hornets-sip.vly.sh";
  console.log(`Setting CONVEX_SITE_URL to ${siteUrl}...`);
  
  const ret2 = spawnSync('npx', ['convex', 'env', 'set', 'CONVEX_SITE_URL', siteUrl], {
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  if (ret2.status !== 0) {
    console.error("Failed to set CONVEX_SITE_URL via CLI.");
  } else {
    console.log("CONVEX_SITE_URL set successfully.");
  }
  
} catch (err) {
  console.error("Error executing convex env set:", err);
  process.exit(1);
}
