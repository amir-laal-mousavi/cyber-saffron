"use node";
import { action } from "./_generated/server";
import { generateKeyPairSync } from "crypto";

export const generate = action({
  args: {},
  handler: async () => {
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
    console.log("--- COPY BELOW THIS LINE ---");
    console.log(privateKey);
    console.log("--- COPY ABOVE THIS LINE ---");
    return "Key generated in logs";
  },
});
