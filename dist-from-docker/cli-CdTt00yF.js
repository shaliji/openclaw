import "./paths-B4BZAPZh.js";
import "./utils-7gb3VEps.js";
import "./thinking-EAliFiVK.js";
import { _t as loadOpenClawPlugins } from "./reply-D1vsenwc.js";
import { d as resolveDefaultAgentId, u as resolveAgentWorkspaceDir } from "./agent-scope-CJVQK_Eg.js";
import { t as createSubsystemLogger } from "./subsystem-C5Sd3JES.js";
import "./exec-DnsD91Q4.js";
import "./model-selection-CWlCAKYd.js";
import "./github-copilot-token-nncItI8D.js";
import "./boolean-BgXe2hyu.js";
import "./env-DkKx0PT3.js";
import "./host-env-security-ljCLeQmh.js";
import "./message-channel-C8Keu0lE.js";
import "./send-CK6aUAzj.js";
import { i as loadConfig } from "./config-D8wVkXOO.js";
import "./env-vars-CvvqezS9.js";
import "./manifest-registry-C6u54rI3.js";
import "./dock-f2PFmcxf.js";
import "./runner-DI4MA20J.js";
import "./image-3Othontc.js";
import "./models-config-DhpgPXvf.js";
import "./pi-model-discovery-Bakt-Qrp.js";
import "./pi-embedded-helpers-BKzcoHME.js";
import "./sandbox-XQnurBEI.js";
import "./tool-catalog-CrsxKKLj.js";
import "./chrome-DalbffIR.js";
import "./tailscale-iTlFoOvr.js";
import "./ip-D0zgNmBV.js";
import "./tailnet-CEudzG0i.js";
import "./ws-BTdBA7Dw.js";
import "./auth-Byh9Posp.js";
import "./server-context-DkmPFYkB.js";
import "./frontmatter-DR47FZL2.js";
import "./skills-H7U30Ato.js";
import "./redact-DKEWQ4ef.js";
import "./errors-DiV2hVgY.js";
import "./fs-safe-DwCRJYoe.js";
import "./trash-BlINPotY.js";
import "./ssrf-D0C-ivqd.js";
import "./image-ops-CT4_RMYw.js";
import "./store-to0SxvTa.js";
import "./ports-CMYOQ1Xv.js";
import "./server-middleware-CQ0JmE7W.js";
import "./sessions-DWrURLaY.js";
import "./plugins-F-mE48FZ.js";
import "./accounts-CvQo4BE0.js";
import "./accounts-C-f1i1Zq.js";
import "./accounts-D5BIfedQ.js";
import "./bindings-CtCN_EAX.js";
import "./logging-B-Pt-Wis.js";
import "./send-rfd4v24x.js";
import "./paths-DI5fQaUg.js";
import "./chat-envelope-CurikSJo.js";
import "./tool-images-GXybOr7q.js";
import "./tool-display-B1TfXD1v.js";
import "./fetch-guard-CTPIWqvT.js";
import "./api-key-rotation-X-MH_7yG.js";
import "./local-roots-DmkVSkOb.js";
import "./query-expansion-Bo6ZAbxf.js";
import "./model-catalog-DWXDcerf.js";
import "./tokens-PTnOjHgI.js";
import "./deliver-DOhOJDf_.js";
import "./commands-D8aBD8y6.js";
import "./commands-registry-CLEhAQdt.js";
import "./pairing-store-BRBe_xQV.js";
import "./fetch-eEAfxvAs.js";
import "./retry-dPM748IP.js";
import "./client-Bri_7bSd.js";
import "./call-Cg3GtUfS.js";
import "./pairing-token-CQfAUfX7.js";
import "./exec-approvals-iddzAkMA.js";
import "./exec-approvals-allowlist-BH3uiQCJ.js";
import "./exec-safe-bin-runtime-policy-Bhlq7BlU.js";
import "./nodes-screen-opLf0Qii.js";
import "./target-errors-Bbcb8HkZ.js";
import "./diagnostic-session-state-JV4FeXBS.js";
import "./with-timeout-BzgYGH0v.js";
import "./diagnostic--FsaT1D9.js";
import "./send-CRwn62gB.js";
import "./model-X_1vSk9O.js";
import "./reply-prefix-NMnkDTVc.js";
import "./memory-cli-f6o2IVjT.js";
import "./manager-25gp-hRR.js";
import "./chunk-gB6ZX5eV.js";
import "./markdown-tables-j3ZRIeYf.js";
import "./ir-CrNoJHlj.js";
import "./render-CJf9B8C2.js";
import "./channel-activity-BCt2tLHC.js";
import "./tables-BiR1cWQ0.js";
import "./send-BhSuRdue.js";
import "./proxy-R5TjOIFS.js";
import "./links-syoLpaiN.js";
import "./cli-utils-BeUql7qI.js";
import "./help-format-DupoBL1v.js";
import "./progress-CzLXOXj6.js";
import "./resolve-route-BXv-aNqC.js";
import "./replies-_pzkoh4P.js";
import "./skill-commands-Cq96yWEx.js";
import "./workspace-dirs-Ds4vwU-k.js";
import "./channel-selection-BC46XmIX.js";
import "./outbound-attachment-Co3EyC58.js";
import "./delivery-queue-IAlLZqh_.js";
import "./session-cost-usage-DY1V4m1N.js";
import "./send-DoR746V0.js";
import "./onboard-helpers-D8SqiGEU.js";
import "./prompt-style-Cpb9Qgq-.js";
import "./pairing-labels-COMNijM9.js";
import "./server-lifecycle-CdNfR43C.js";
import "./stagger-C9cy2z6C.js";
import "./pi-tools.policy-C9wHYVyd.js";

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