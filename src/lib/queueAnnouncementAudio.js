/** @format */

const AUDIO_BASE_URL = `${import.meta.env.BASE_URL}audio`;
const INTER_CLIP_GAP_SECONDS = 0.08;
const REQUIRED_AUDIO_FILES = [
    "phrase_roll_number.mp3",
    "phrase_room_number.mp3",
    ...Array.from({ length: 10 }, (_, digit) => `number_00${digit}.mp3`),
];

const getDigitAudioFiles = (value) =>
    String(value ?? "")
        .match(/\d/g)
        ?.map((digit) => `number_00${digit}.mp3`) ?? [];

const getAudioContextConstructor = () =>
    window.AudioContext || window.webkitAudioContext;

export const createQueueAnnouncementPlayer = ({
    onStateChange = () => { },
    onError = () => { },
} = {}) => {
    let audioContext = null;
    let preloadPromise = null;
    let processing = false;
    let destroyed = false;
    let activeCancellation = null;
    let preloadController = null;
    const audioBuffers = new Map();
    const announcementQueue = [];

    const emitState = (state) => {
        if (!destroyed) onStateChange(state);
    };

    const ensureAudioContext = () => {
        if (audioContext) return audioContext;

        const AudioContextConstructor = getAudioContextConstructor();
        if (!AudioContextConstructor) {
            throw new Error("Web Audio is not supported in this browser.");
        }

        audioContext = new AudioContextConstructor();
        audioContext.onstatechange = () => {
            if (audioContext.state === "suspended") {
                emitState("locked");
            }
        };
        return audioContext;
    };

    const initialize = async () => {
        if (destroyed) return;

        const context = ensureAudioContext();
        if (!preloadPromise) {
            emitState("loading");
            preloadController = new AbortController();
            preloadPromise = Promise.all(
                REQUIRED_AUDIO_FILES.map(async (fileName) => {
                    const response = await fetch(`${AUDIO_BASE_URL}/${fileName}`, {
                        signal: preloadController.signal,
                    });
                    if (!response.ok) {
                        throw new Error(`Could not load ${fileName}.`);
                    }

                    const buffer = await context.decodeAudioData(
                        await response.arrayBuffer(),
                    );
                    if (!destroyed) audioBuffers.set(fileName, buffer);
                }),
            ).catch((error) => {
                preloadPromise = null;
                audioBuffers.clear();
                throw error;
            }).finally(() => {
                preloadController = null;
            });
        }

        try {
            await preloadPromise;
            emitState(context.state === "running" ? "ready" : "locked");
        } catch (error) {
            emitState("error");
            if (!destroyed && error.name !== "AbortError") onError(error);
            throw error;
        }
    };

    const playFiles = (fileNames) =>
        new Promise((resolve, reject) => {
            const context = ensureAudioContext();
            const sources = [];
            let settled = false;
            let startTime = context.currentTime + 0.03;

            const settle = (callback, value) => {
                if (settled) return;
                settled = true;
                activeCancellation = null;
                callback(value);
            };

            try {
                fileNames.forEach((fileName, index) => {
                    const buffer = audioBuffers.get(fileName);
                    if (!buffer) throw new Error(`Audio is not ready for ${fileName}.`);

                    const source = context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(context.destination);
                    sources.push(source);

                    if (index === fileNames.length - 1) {
                        source.onended = () => settle(resolve);
                    }

                    source.start(startTime);
                    startTime += buffer.duration + INTER_CLIP_GAP_SECONDS;
                });

                activeCancellation = () => {
                    sources.forEach((source) => {
                        try {
                            source.stop();
                        } catch {
                            // A source that already ended does not need cancellation.
                        }
                    });
                    settle(
                        reject,
                        new DOMException("Audio playback cancelled", "AbortError"),
                    );
                };
            } catch (error) {
                sources.forEach((source) => {
                    try {
                        source.stop();
                    } catch {
                        // Ignore sources that did not start.
                    }
                });
                settle(reject, error);
            }
        });

    const playAnnouncement = async ({ rollNumber, counterName }) => {
        const rollNumberFiles = getDigitAudioFiles(rollNumber);
        const counterFiles = getDigitAudioFiles(counterName);

        if (rollNumberFiles.length < 1) {
            throw new Error("Announcement does not contain a valid roll number.");
        }
        if (counterFiles.length < 1) {
            throw new Error("Assigned counter does not contain a room number.");
        }

        await playFiles([
            "phrase_roll_number.mp3",
            ...rollNumberFiles,
            "phrase_room_number.mp3",
            ...counterFiles,
        ]);
    };

    const processQueue = async () => {
        if (
            processing
            || destroyed
            || !audioContext
            || audioContext.state !== "running"
            || audioBuffers.size !== REQUIRED_AUDIO_FILES.length
        ) {
            return;
        }

        processing = true;
        try {
            while (
                !destroyed
                && audioContext.state === "running"
                && announcementQueue.length > 0
            ) {
                const announcement = announcementQueue.shift();
                emitState("playing");
                try {
                    await playAnnouncement(announcement);
                } catch (error) {
                    if (error.name !== "AbortError") onError(error);
                }
            }
        } finally {
            processing = false;
            if (!destroyed) {
                emitState(audioContext.state === "running" ? "ready" : "locked");
            }
        }
    };

    const enqueue = (announcement) => {
        if (destroyed) return;

        announcementQueue.push(announcement);
        initialize()
            .then(processQueue)
            .catch(() => {
                // Keep queued announcements available for a later initialization retry.
            });
    };

    const unlock = async () => {
        if (destroyed) return;

        const context = ensureAudioContext();
        await context.resume();
        if (context.state !== "running") {
            emitState("locked");
            throw new DOMException(
                "The browser did not allow audio playback.",
                "NotAllowedError",
            );
        }

        await initialize();
        await processQueue();
    };

    const destroy = () => {
        if (destroyed) return;

        destroyed = true;
        announcementQueue.length = 0;
        preloadController?.abort();
        activeCancellation?.();
        if (audioContext) {
            audioContext.onstatechange = null;
            audioContext.close().catch(() => { });
        }
    };

    return { initialize, enqueue, unlock, destroy };
};