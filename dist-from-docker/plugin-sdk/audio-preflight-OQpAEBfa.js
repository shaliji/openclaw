import "./accounts-nRb69JLQ.js";
import "./paths-DVWx7USN.js";
import "./github-copilot-token-Cg0YPPSu.js";
import "./plugins-C_oazOl4.js";
import { Z as logVerbose, et as shouldLogVerbose } from "./subsystem-D1LlWNKh.js";
import "./config-b1GE10z7.js";
import "./command-format-DoSIFR_b.js";
import "./model-selection-KxC5cuqU.js";
import "./agent-scope-BNHH2QOv.js";
import "./manifest-registry-Ctatc67v.js";
import "./dock-CQy_H_Rg.js";
import "./redact-CamFT8Bc.js";
import "./errors-DxNipVio.js";
import "./image-ops-CmUQkJk5.js";
import "./ssrf-CnX37IfG.js";
import "./fetch-guard-CMFgPVHO.js";
import "./local-roots-D_P4PWjD.js";
import "./message-channel-2ePfk9N2.js";
import "./bindings-_G28rRDZ.js";
import "./tool-images-tydwRamF.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-fuad4tp5.js";
import "./skills-Cc6Zi6ij.js";
import "./chrome-Bf_EB-XC.js";
import "./accounts-BhEg4pJ-.js";
import "./accounts-CCH31kh4.js";
import "./sessions-BBcAttd6.js";
import "./paths-B-NY-HdV.js";
import "./store-QhgTD87A.js";
import "./pi-embedded-helpers-4YApvSwn.js";
import "./thinking-BpFZfHN9.js";
import "./image-BeqE3a3I.js";
import "./pi-model-discovery-CNP1dAqt.js";
import "./api-key-rotation-CEGYGiJF.js";

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