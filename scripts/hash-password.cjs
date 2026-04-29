/* Usage:
 *   npm run hash-admin-password
 *   (saisie interactive — recommandé si le mot de passe contient ! " $ etc.)
 *
 *   npm run hash-admin-password -- 'ton-mot-de-passe'
 *   (guillemets SIMPLES sous bash si le mot de passe contient !)
 */
const readline = require("readline");
const bcrypt = require("bcryptjs");

function printHash(pwd) {
  if (!pwd) {
    console.error("Mot de passe vide.");
    process.exit(1);
  }
  const hash = bcrypt.hashSync(pwd, 12);
  const b64 = Buffer.from(hash, "utf8").toString("base64");

  console.log(
    "\n--- À coller dans .env.local (recommandé, sans caractère $) ---\n",
  );
  console.log(`ADMIN_PASSWORD_HASH_B64=${b64}\n`);
  console.log(
    "(Next.js interprète les $ dans ADMIN_PASSWORD_HASH : sans B64 le hash est souvent cassé → « mot de passe incorrect ».)\n",
  );
}

const fromCli = process.argv[2];
if (fromCli) {
  printHash(fromCli);
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Mot de passe admin : ", (pwd) => {
  rl.close();
  printHash(pwd);
});
