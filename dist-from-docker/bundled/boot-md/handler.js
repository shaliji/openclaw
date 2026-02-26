import { n as listAgentIds, s as resolveAgentWorkspaceDir } from "../../agent-scope-C8XgeDR5.js";
import "../../paths-C9do7WCN.js";
import { dt as isGatewayStartupEvent, r as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-OjJSGqSf.js";
import { l as resolveAgentIdFromSessionKey } from "../../session-key-YGVrIVO5.js";
import "../../workspace-DY9OyQ1v.js";
import "../../model-selection-BBnmA-Of.js";
import "../../github-copilot-token-BkwQAVvU.js";
import "../../env-1KrR5vLt.js";
import "../../boolean-mcn6kL0s.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-B_0Z9EXZ.js";
import { a as createDefaultDeps, i as agentCommand } from "../../pi-embedded-ks78_miO.js";
import "../../plugins-CNLxCJ1d.js";
import "../../accounts-BtvdrZM5.js";
import "../../bindings-5FwdCf0s.js";
import "../../send-jinc0DJM.js";
import "../../send-aDdZUBJE.js";
import "../../deliver-DACk9SZ3.js";
import "../../diagnostic-CV-iGwD-.js";
import "../../diagnostic-session-state-C0Sxjfox.js";
import "../../accounts-Db1Y0y43.js";
import "../../send-25OH4cMk.js";
import "../../image-ops-DPerqzPA.js";
import "../../pi-model-discovery-C-yOXpma.js";
import "../../message-channel-7XB7U9SO.js";
import "../../pi-embedded-helpers-BQPijz5G.js";
import "../../config-CjZeYRah.js";
import "../../manifest-registry-CUs1bNb-.js";
import "../../dock-D78SI-ci.js";
import "../../chrome-rKilqxPX.js";
import "../../ssrf-BnuIFCPj.js";
import "../../frontmatter-CYyVkHva.js";
import "../../skills-Us97susq.js";
import "../../redact-DMW6QgGu.js";
import "../../errors-DIsGKZHp.js";
import "../../store-Svk1_jis.js";
import { B as resolveAgentMainSessionKey, H as resolveMainSessionKey, d as updateSessionStore, s as loadSessionStore } from "../../sessions-CEBuOkF2.js";
import "../../accounts-zzqNS5JN.js";
import { l as resolveStorePath } from "../../paths-CLWDvYDE.js";
import "../../tool-images-iSiJa9Xi.js";
import "../../thinking-CJoHneR6.js";
import "../../image-DYYTV3fk.js";
import "../../reply-prefix--_eSjy3_.js";
import "../../manager-Bnu0Cuxf.js";
import "../../gemini-auth-8ieCowdW.js";
import "../../fetch-guard-DM0-3zMs.js";
import "../../query-expansion-B9SNqtjP.js";
import "../../retry-CQJMQLyQ.js";
import "../../target-errors-DOOTGXsU.js";
import "../../chunk-BAYd4en5.js";
import "../../markdown-tables-bWNZ-uiL.js";
import "../../local-roots-CGel6LRo.js";
import "../../ir-BG5AdJZ8.js";
import "../../render-loap2gRq.js";
import "../../commands-registry-DAfXX2g5.js";
import "../../skill-commands-lTcoB8W_.js";
import "../../runner-hsYT-6_h.js";
import "../../fetch-B1nZSYJF.js";
import "../../channel-activity-BhCtwPtR.js";
import "../../tables-BpAn2yRf.js";
import "../../send-DAhibHHN.js";
import "../../outbound-attachment-Cjj4ZGD-.js";
import "../../send-C9t5Fl9g.js";
import "../../resolve-route--uB6HhRU.js";
import "../../proxy-Bee2aKQk.js";
import "../../replies-C7tLP_rH.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	return [
		"You are running a boot check. Follow BOOT.md instructions exactly.",
		"",
		"BOOT.md:",
		content,
		"",
		"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
		"Use the `target` field (not `to`) for message tool destinations.",
		`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
		`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
	].join("\n");
}
async function loadBootFile(workspaceDir) {
	const bootPath = path.join(workspaceDir, BOOT_FILENAME);
	try {
		const trimmed = (await fs.readFile(bootPath, "utf-8")).trim();
		if (!trimmed) return { status: "empty" };
		return {
			status: "ok",
			content: trimmed
		};
	} catch (err) {
		if (err.code === "ENOENT") return { status: "missing" };
		throw err;
	}
}
function snapshotMainSessionMapping(params) {
	const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
	try {
		const entry = loadSessionStore(storePath, { skipCache: true })[params.sessionKey];
		if (!entry) return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: false
		};
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: true,
			entry: structuredClone(entry)
		};
	} catch (err) {
		log$1.debug("boot: could not snapshot main session mapping", {
			sessionKey: params.sessionKey,
			error: String(err)
		});
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: false,
			hadEntry: false
		};
	}
}
async function restoreMainSessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		await updateSessionStore(snapshot.storePath, (store) => {
			if (snapshot.hadEntry && snapshot.entry) {
				store[snapshot.sessionKey] = snapshot.entry;
				return;
			}
			delete store[snapshot.sessionKey];
		}, { activeSessionKey: snapshot.sessionKey });
		return;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
}
async function runBootOnce(params) {
	const bootRuntime = {
		log: () => {},
		error: (message) => log$1.error(String(message)),
		exit: defaultRuntime.exit
	};
	let result;
	try {
		result = await loadBootFile(params.workspaceDir);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: failed to read ${BOOT_FILENAME}: ${message}`);
		return {
			status: "failed",
			reason: message
		};
	}
	if (result.status === "missing" || result.status === "empty") return {
		status: "skipped",
		reason: result.status
	};
	const sessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const message = buildBootPrompt(result.content ?? "");
	const sessionId = generateBootSessionId();
	const mappingSnapshot = snapshotMainSessionMapping({
		cfg: params.cfg,
		sessionKey
	});
	let agentFailure;
	try {
		await agentCommand({
			message,
			sessionKey,
			sessionId,
			deliver: false
		}, bootRuntime, params.deps);
	} catch (err) {
		agentFailure = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: agent run failed: ${agentFailure}`);
	}
	const mappingRestoreFailure = await restoreMainSessionMapping(mappingSnapshot);
	if (mappingRestoreFailure) log$1.error(`boot: failed to restore main session mapping: ${mappingRestoreFailure}`);
	if (!agentFailure && !mappingRestoreFailure) return { status: "ran" };
	return {
		status: "failed",
		reason: [agentFailure ? `agent run failed: ${agentFailure}` : void 0, mappingRestoreFailure ? `mapping restore failed: ${mappingRestoreFailure}` : void 0].filter((part) => Boolean(part)).join("; ")
	};
}

//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
const runBootChecklist = async (event) => {
	if (!isGatewayStartupEvent(event)) return;
	if (!event.context.cfg) return;
	const cfg = event.context.cfg;
	const deps = event.context.deps ?? createDefaultDeps();
	const agentIds = listAgentIds(cfg);
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const result = await runBootOnce({
			cfg,
			deps,
			workspaceDir,
			agentId
		});
		if (result.status === "failed") {
			log.warn("boot-md failed for agent startup run", {
				agentId,
				workspaceDir,
				reason: result.reason
			});
			continue;
		}
		if (result.status === "skipped") log.debug("boot-md skipped for agent startup run", {
			agentId,
			workspaceDir,
			reason: result.reason
		});
	}
};

//#endregion
export { runBootChecklist as default };