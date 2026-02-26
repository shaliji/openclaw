import "./agent-scope-Hfb1XxZc.js";
import "./paths-BY8fKpqm.js";
import { J as logVerbose, Z as shouldLogVerbose } from "./subsystem-Ck26JAQG.js";
import "./model-selection-yDyI_l01.js";
import "./github-copilot-token-D8k4aAom.js";
import "./env-BlZ2KU7g.js";
import "./plugins-ZH-JM93h.js";
import "./accounts-BoFg1f6e.js";
import "./bindings-CldMmnZj.js";
import "./accounts-D7QA6mSG.js";
import "./image-ops-BMu2pljU.js";
import "./pi-model-discovery-DaNAekda.js";
import "./message-channel-CTEYhii8.js";
import "./pi-embedded-helpers-DQQpiQXt.js";
import "./config-iMXuX63S.js";
import "./manifest-registry-RfG50-0E.js";
import "./dock-CHJeq1vk.js";
import "./chrome-C3MIrMDa.js";
import "./ssrf-B7akL5oa.js";
import "./skills-DLU3Jlvr.js";
import "./redact-DuzbwM25.js";
import "./errors-DPA8_FS3.js";
import "./store-CqgAJQgf.js";
import "./sessions-ROkwCDZM.js";
import "./accounts-Ct8GydwU.js";
import "./paths-DbuO2gD6.js";
import "./tool-images-DHyP4K9M.js";
import "./thinking-ZaPrKXBc.js";
import "./image-DEHZkU0P.js";
import "./gemini-auth-B3cFm0zV.js";
import "./fetch-guard-CdOjNpSc.js";
import "./local-roots-D0Xbo4Xx.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-CYl9Zng5.js";

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