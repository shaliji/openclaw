import { s as createSubsystemLogger } from "./entry.js";
import "./auth-profiles-vU5h6gxf.js";
import { d as resolveDefaultAgentId, u as resolveAgentWorkspaceDir } from "./agent-scope-BWoB6KB9.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./model-Csk0ByVm.js";
import "./pi-model-discovery-CwESh4K1.js";
import "./frontmatter-17nP3KZr.js";
import "./skills-CWeJXlIQ.js";
import "./manifest-registry-BPlNBgie.js";
import { i as loadConfig } from "./config-LXNfmZdV.js";
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
import "./send-BinN2sn8.js";
import "./send-BCwiIq7z.js";
import { _ as loadOpenClawPlugins } from "./subagent-registry-iN-FM0Uz.js";
import "./paths-Dvmk_rXi.js";
import "./chat-envelope-BG_U_muK.js";
import "./client-BtjXMOD6.js";
import "./call-wW8gVtcZ.js";
import "./pairing-token-qLzAsGdq.js";
import "./net-BEAjYacy.js";
import "./ip-m9Sjsn1o.js";
import "./tailnet-BOWO-AaH.js";
import "./tokens-D60Twogq.js";
import "./with-timeout-DMFffs65.js";
import "./deliver-5phD_2ry.js";
import "./diagnostic-J4rp2SRl.js";
import "./diagnostic-session-state-CT36_PCE.js";
import "./send-CPqWCIpr.js";
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
import "./models-config-gjIj_GyC.js";
import "./exec-approvals-allowlist-CAh0W7ko.js";
import "./exec-safe-bin-runtime-policy-BTyJM7i6.js";
import "./reply-prefix-CDxxY0BF.js";
import "./memory-cli-DAIF-Rwe.js";
import "./manager--aJTY1M6.js";
import "./gemini-auth-Bj9G0aYa.js";
import "./fetch-guard-D9xirO1r.js";
import "./query-expansion-BTx3AUZ-.js";
import "./retry-BLB59C0N.js";
import "./target-errors-BxFxCuxQ.js";
import "./chunk-BvqBAgzS.js";
import "./markdown-tables-3qg0i1mX.js";
import "./local-roots-CUvR-0Wl.js";
import "./ir-DEF2fXbJ.js";
import "./render-Bdn0My43.js";
import "./commands-DwTwWbLM.js";
import "./commands-registry-BVUPxlFP.js";
import "./image-C6U9TGpS.js";
import "./tool-display-9_qVpbf1.js";
import "./runner-CM2qQk09.js";
import "./model-catalog-BORjXO2a.js";
import "./pairing-store-DkHgoxfi.js";
import "./fetch-Cg7F6jVj.js";
import "./exec-approvals-B-M763CP.js";
import "./nodes-screen-BPGhiVFW.js";
import "./session-utils-nIQrkuo2.js";
import "./session-cost-usage-CvGuEEE6.js";
import "./skill-commands-DzjndRk1.js";
import "./workspace-dirs-CZlBo4RA.js";
import "./channel-activity-Czj5FT0A.js";
import "./tables-Dck0gJ_h.js";
import "./server-lifecycle-BoN72-1q.js";
import "./stagger-wClkZ9EC.js";
import "./channel-selection-D-n95OK4.js";
import "./send-pdTohvX-.js";
import "./outbound-attachment-Cipcg1Zh.js";
import "./delivery-queue-ChFqRLAV.js";
import "./send-CKbo9v0Q.js";
import "./resolve-route-xvP2zFSQ.js";
import "./proxy-WehDGK1u.js";
import "./links-DNSoSnpZ.js";
import "./cli-utils-DyGKoc5l.js";
import "./help-format-CSCL71i7.js";
import "./progress-NYYdD1uh.js";
import "./replies-CG_wcwKh.js";
import "./onboard-helpers-RAaNUuUn.js";
import "./prompt-style-EoDyMHYF.js";
import "./pairing-labels-BZuavyLB.js";
import "./pi-tools.policy-CoDNviq1.js";

//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function registerPluginCliCommands(program, cfg) {
	const config = cfg ?? loadConfig();
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	const registry = loadOpenClawPlugins({
		config,
		workspaceDir,
		logger
	});
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}

//#endregion
export { registerPluginCliCommands };