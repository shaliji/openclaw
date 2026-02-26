import "./agent-scope-C8XgeDR5.js";
import "./paths-C9do7WCN.js";
import { J as logVerbose, Z as shouldLogVerbose } from "./subsystem-OjJSGqSf.js";
import "./workspace-DY9OyQ1v.js";
import "./model-selection-BBnmA-Of.js";
import "./github-copilot-token-BkwQAVvU.js";
import "./env-1KrR5vLt.js";
import "./boolean-mcn6kL0s.js";
import "./plugins-CNLxCJ1d.js";
import "./accounts-BtvdrZM5.js";
import "./bindings-5FwdCf0s.js";
import "./accounts-Db1Y0y43.js";
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
import "./gemini-auth-8ieCowdW.js";
import "./fetch-guard-DM0-3zMs.js";
import "./local-roots-CGel6LRo.js";
import { a as resolveMediaAttachmentLocalRoots, n as createMediaAttachmentCache, o as runCapability, r as normalizeMediaAttachments, t as buildProviderRegistry, u as isAudioAttachment } from "./runner-hsYT-6_h.js";

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