import { join } from "jsr:@std/path@1.0.8";
import { parseArgs } from "jsr:@std/cli@1.0.9";
import { Buffer } from "node:buffer";

const decoder = new TextDecoder();

const denoJson = JSON.parse(decoder.decode(
  Deno.readFileSync(join(Deno.cwd(), "deno.json")),
));

console.log(`Current version is: ${denoJson.version}`);

const newVersion = parseArgs(Deno.args)._[0].toString();

const semver = /\d+\.\d+\.\d+/;
const isValid = !!newVersion?.match(semver);

if (!isValid) {
  console.error("Version provided is not valid semver");
  Deno.exit(1);
}

denoJson.version = newVersion;

console.log("Saving new version to deno.json");

Deno.writeFileSync(
  join(Deno.cwd(), "deno.json"),
  Buffer.from(JSON.stringify(denoJson, null, 2)),
);

console.log("Pushing new git tag");

console.log(`Set version and tag to: ${newVersion}`);
