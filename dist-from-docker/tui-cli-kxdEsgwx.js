import { Dt as theme, v as defaultRuntime } from "./entry.js";
import "./auth-profiles-vU5h6gxf.js";
import "./agent-scope-BWoB6KB9.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./frontmatter-17nP3KZr.js";
import "./skills-CWeJXlIQ.js";
import "./manifest-registry-BPlNBgie.js";
import "./config-LXNfmZdV.js";
import "./env-vars-iFkEK4MO.js";
import "./dock-CY2mcZqe.js";
import "./message-channel-CIQTys4Q.js";
import "./sessions-YJLT80__.js";
import "./plugins-B-4EYGZt.js";
import "./accounts-g8UOA9ZQ.js";
import "./accounts-iAP56FFD.js";
import "./accounts-B7WS3ElX.js";
import "./bindings-CqPOClAk.js";
import "./logging-CFvkxgcX.js";
import "./paths-Dvmk_rXi.js";
import "./chat-envelope-BG_U_muK.js";
import "./client-BtjXMOD6.js";
import "./call-wW8gVtcZ.js";
import "./pairing-token-qLzAsGdq.js";
import "./net-BEAjYacy.js";
import "./ip-m9Sjsn1o.js";
import "./tailnet-BOWO-AaH.js";
import "./image-ops-CdtmwUCR.js";
import "./pi-embedded-helpers-exOSg0SH.js";
import "./sandbox-DbkY-n_5.js";
import "./tool-catalog-BS-Gk_Yg.js";
import "./chrome-C87R1Xsf.js";
import "./tailscale-B21pc9dr.js";
import "./auth-Dw00sIWu.js";
import "./server-context-D3vMUOx2.js";
import "./redact-CjuqjXFe.js";
import "./errors-DjnYuRJy.js";
import "./fs-safe-Cwp1VOPx.js";
import "./trash-CX7nB-3e.js";
import "./ssrf-BjDQh-0k.js";
import "./store-CP7czNHW.js";
import "./ports-CCM0e3iq.js";
import "./server-middleware-ti_BzwRQ.js";
import "./tool-images-DfuwmJ1p.js";
import "./thinking-BF74hBT8.js";
import "./commands-DwTwWbLM.js";
import "./commands-registry-BVUPxlFP.js";
import "./tool-display-9_qVpbf1.js";
import { t as parseTimeoutMs } from "./parse-timeout-DrSLkPL_.js";
import { t as formatDocsLink } from "./links-DNSoSnpZ.js";
import { t as runTui } from "./tui-DwxyEc4Q.js";

//#region src/cli/tui-cli.ts
function registerTuiCli(program) {
	program.command("tui").description("Open a terminal UI connected to the Gateway").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--session <key>", "Session key (default: \"main\", or \"global\" when scope is global)").option("--deliver", "Deliver assistant replies", false).option("--thinking <level>", "Thinking level override").option("--message <text>", "Send an initial message after connecting").option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)").option("--history-limit <n>", "History entries to load", "200").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openclaw.ai/cli/tui")}\n`).action(async (opts) => {
		try {
			const timeoutMs = parseTimeoutMs(opts.timeoutMs);
			if (opts.timeoutMs !== void 0 && timeoutMs === void 0) defaultRuntime.error(`warning: invalid --timeout-ms "${String(opts.timeoutMs)}"; ignoring`);
			const historyLimit = Number.parseInt(String(opts.historyLimit ?? "200"), 10);
			await runTui({
				url: opts.url,
				token: opts.token,
				password: opts.password,
				session: opts.session,
				deliver: Boolean(opts.deliver),
				thinking: opts.thinking,
				message: opts.message,
				timeoutMs,
				historyLimit: Number.isNaN(historyLimit) ? void 0 : historyLimit
			});
		} catch (err) {
			defaultRuntime.error(String(err));
			defaultRuntime.exit(1);
		}
	});
}

//#endregion
export { registerTuiCli };