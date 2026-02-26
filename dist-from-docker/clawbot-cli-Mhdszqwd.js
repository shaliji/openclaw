import { Dt as theme } from "./entry.js";
import "./auth-profiles-vU5h6gxf.js";
import "./agent-scope-BWoB6KB9.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./manifest-registry-BPlNBgie.js";
import "./config-LXNfmZdV.js";
import "./env-vars-iFkEK4MO.js";
import "./ip-m9Sjsn1o.js";
import { t as formatDocsLink } from "./links-DNSoSnpZ.js";
import { n as registerQrCli } from "./qr-cli-BpPQv8Fx.js";

//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}

//#endregion
export { registerClawbotCli };