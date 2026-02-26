import { a as resolveAgentEffectiveModelPrimary, c as resolveDefaultAgentId, i as resolveAgentDir, s as resolveAgentWorkspaceDir } from "./agent-scope-C8XgeDR5.js";
import "./paths-C9do7WCN.js";
import { t as createSubsystemLogger } from "./subsystem-OjJSGqSf.js";
import "./workspace-DY9OyQ1v.js";
import { it as DEFAULT_PROVIDER, l as parseModelRef, rt as DEFAULT_MODEL } from "./model-selection-BBnmA-Of.js";
import "./github-copilot-token-BkwQAVvU.js";
import "./env-1KrR5vLt.js";
import "./boolean-mcn6kL0s.js";
import "./tokens-B_0Z9EXZ.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-ks78_miO.js";
import "./plugins-CNLxCJ1d.js";
import "./accounts-BtvdrZM5.js";
import "./bindings-5FwdCf0s.js";
import "./send-jinc0DJM.js";
import "./send-aDdZUBJE.js";
import "./deliver-DACk9SZ3.js";
import "./diagnostic-CV-iGwD-.js";
import "./diagnostic-session-state-C0Sxjfox.js";
import "./accounts-Db1Y0y43.js";
import "./send-25OH4cMk.js";
import "./image-ops-DPerqzPA.js";
import "./pi-model-discovery-C-yOXpma.js";
import "./message-channel-7XB7U9SO.js";
import "./pi-embedded-helpers-BQPijz5G.js";
import "./config-CjZeYRah.js";
import "./manifest-registry-CUs1bNb-.js";
import "./dock-D78SI-ci.js";
import "./chrome-rKilqxPX.js";
import "./ssrf-BnuIFCPj.js";
import "./frontmatter-CYyVkHva.js";
import "./skills-Us97susq.js";
import "./redact-DMW6QgGu.js";
import "./errors-DIsGKZHp.js";
import "./store-Svk1_jis.js";
import "./sessions-CEBuOkF2.js";
import "./accounts-zzqNS5JN.js";
import "./paths-CLWDvYDE.js";
import "./tool-images-iSiJa9Xi.js";
import "./thinking-CJoHneR6.js";
import "./image-DYYTV3fk.js";
import "./reply-prefix--_eSjy3_.js";
import "./manager-Bnu0Cuxf.js";
import "./gemini-auth-8ieCowdW.js";
import "./fetch-guard-DM0-3zMs.js";
import "./query-expansion-B9SNqtjP.js";
import "./retry-CQJMQLyQ.js";
import "./target-errors-DOOTGXsU.js";
import "./chunk-BAYd4en5.js";
import "./markdown-tables-bWNZ-uiL.js";
import "./local-roots-CGel6LRo.js";
import "./ir-BG5AdJZ8.js";
import "./render-loap2gRq.js";
import "./commands-registry-DAfXX2g5.js";
import "./skill-commands-lTcoB8W_.js";
import "./runner-hsYT-6_h.js";
import "./fetch-B1nZSYJF.js";
import "./channel-activity-BhCtwPtR.js";
import "./tables-BpAn2yRf.js";
import "./send-DAhibHHN.js";
import "./outbound-attachment-Cjj4ZGD-.js";
import "./send-C9t5Fl9g.js";
import "./resolve-route--uB6HhRU.js";
import "./proxy-Bee2aKQk.js";
import "./replies-C7tLP_rH.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

//#region src/hooks/llm-slug-generator.ts
/**
* LLM-based slug generator for session memory filenames
*/
const log = createSubsystemLogger("llm-slug-generator");
/**
* Generate a short 1-2 word filename slug from session content using LLM
*/
async function generateSlugViaLLM(params) {
	let tempSessionFile = null;
	try {
		const agentId = resolveDefaultAgentId(params.cfg);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slug-"));
		tempSessionFile = path.join(tempDir, "session.jsonl");
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${params.sessionContent.slice(0, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const modelRef = resolveAgentEffectiveModelPrimary(params.cfg, agentId);
		const parsed = modelRef ? parseModelRef(modelRef, DEFAULT_PROVIDER) : null;
		const provider = parsed?.provider ?? DEFAULT_PROVIDER;
		const model = parsed?.model ?? DEFAULT_MODEL;
		const result = await runEmbeddedPiAgent({
			sessionId: `slug-generator-${Date.now()}`,
			sessionKey: "temp:slug-generator",
			agentId,
			sessionFile: tempSessionFile,
			workspaceDir,
			agentDir,
			config: params.cfg,
			prompt,
			provider,
			model,
			timeoutMs: 15e3,
			runId: `slug-gen-${Date.now()}`
		});
		if (result.payloads && result.payloads.length > 0) {
			const text = result.payloads[0]?.text;
			if (text) return text.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || null;
		}
		return null;
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.error(`Failed to generate slug: ${message}`);
		return null;
	} finally {
		if (tempSessionFile) try {
			await fs.rm(path.dirname(tempSessionFile), {
				recursive: true,
				force: true
			});
		} catch {}
	}
}

//#endregion
export { generateSlugViaLLM };