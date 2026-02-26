import { r as resolveWhatsAppAccount } from "./accounts-nRb69JLQ.js";
import "./paths-DVWx7USN.js";
import "./github-copilot-token-Cg0YPPSu.js";
import "./plugins-C_oazOl4.js";
import "./subsystem-D1LlWNKh.js";
import "./config-b1GE10z7.js";
import "./command-format-DoSIFR_b.js";
import "./model-selection-KxC5cuqU.js";
import "./agent-scope-BNHH2QOv.js";
import "./manifest-registry-Ctatc67v.js";
import "./image-ops-CmUQkJk5.js";
import "./ssrf-CnX37IfG.js";
import "./fetch-guard-CMFgPVHO.js";
import "./local-roots-D_P4PWjD.js";
import "./ir-Bv4SEXx8.js";
import "./chunk-lbYIkQbr.js";
import "./message-channel-2ePfk9N2.js";
import "./bindings-_G28rRDZ.js";
import "./markdown-tables-BS0IHHiP.js";
import "./render-3_VJ30aR.js";
import "./tables-Dh3DNgx4.js";
import "./tool-images-tydwRamF.js";
import { a as createActionGate, c as jsonResult, d as readReactionParams, i as ToolAuthorizationError, m as readStringParam } from "./target-errors-B7pwmBFE.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-DM7FRy6y.js";
import { r as sendReactionWhatsApp } from "./outbound-DCcP9Ag3.js";

//#region src/agents/tools/whatsapp-target-auth.ts
function resolveAuthorizedWhatsAppOutboundTarget(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolution = resolveWhatsAppOutboundTarget({
		to: params.chatJid,
		allowFrom: account.allowFrom ?? [],
		mode: "implicit"
	});
	if (!resolution.ok) throw new ToolAuthorizationError(`WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`);
	return {
		to: resolution.to,
		accountId: account.accountId
	};
}

//#endregion
//#region src/agents/tools/whatsapp-actions.ts
async function handleWhatsAppAction(params, cfg) {
	const action = readStringParam(params, "action", { required: true });
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	if (action === "react") {
		if (!isActionEnabled("reactions")) throw new Error("WhatsApp reactions are disabled.");
		const chatJid = readStringParam(params, "chatJid", { required: true });
		const messageId = readStringParam(params, "messageId", { required: true });
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a WhatsApp reaction." });
		const participant = readStringParam(params, "participant");
		const accountId = readStringParam(params, "accountId");
		const fromMeRaw = params.fromMe;
		const fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : void 0;
		const resolved = resolveAuthorizedWhatsAppOutboundTarget({
			cfg,
			chatJid,
			accountId,
			actionLabel: "reaction"
		});
		const resolvedEmoji = remove ? "" : emoji;
		await sendReactionWhatsApp(resolved.to, messageId, resolvedEmoji, {
			verbose: false,
			fromMe,
			participant: participant ?? void 0,
			accountId: resolved.accountId
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	throw new Error(`Unsupported WhatsApp action: ${action}`);
}

//#endregion
export { handleWhatsAppAction };