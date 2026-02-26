import { St as shouldLogVerbose, yt as logVerbose } from "./entry.js";
import "./auth-profiles-vU5h6gxf.js";
import "./agent-scope-BWoB6KB9.js";
import "./exec-G9-WTRVN.js";
import "./github-copilot-token-RNgXBxZS.js";
import "./host-env-security-DyQuUnEd.js";
import "./pi-model-discovery-CwESh4K1.js";
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
import "./models-config-gjIj_GyC.js";
import "./gemini-auth-Bj9G0aYa.js";
import "./fetch-guard-D9xirO1r.js";
import "./local-roots-CUvR-0Wl.js";
import "./image-C6U9TGpS.js";
import "./tool-display-9_qVpbf1.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, s as isAudioAttachment, t as buildProviderRegistry } from "./runner-CM2qQk09.js";
import "./model-catalog-BORjXO2a.js";

//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	const providerRegistry = buildProviderRegistry(params.providers);
	const cache = createMediaAttachmentCache(attachments, { localPathRoots: resolveMediaAttachmentLocalRoots({
		cfg,
		ctx
	}) });
	try {
		const result = await runCapability({
			capability: "audio",
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			agentDir: params.agentDir,
			providerRegistry,
			config: audioConfig,
			activeModel: params.activeModel
		});
		if (!result || result.outputs.length === 0) return;
		const audioOutput = result.outputs.find((output) => output.kind === "audio.transcription");
		if (!audioOutput || !audioOutput.text) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${audioOutput.text.length} chars from attachment ${firstAudio.index}`);
		return audioOutput.text;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	} finally {
		await cache.cleanup();
	}
}

//#endregion
export { transcribeFirstAudio };