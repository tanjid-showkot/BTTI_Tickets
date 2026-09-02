/** @format */

const AUDIO_BASE_URL = `${import.meta.env.BASE_URL}audio`;

const getDigitAudioFiles = (value) =>
    String(value ?? "")
        .match(/\d/g)
        ?.map((digit) => `number_00${digit}.mp3`) ?? [];

const playAudioFile = (fileName, signal) =>
    new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new DOMException("Audio playback cancelled", "AbortError"));
            return;
        }

        const audio = new Audio(`${AUDIO_BASE_URL}/${fileName}`);

        const cleanup = () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            signal.removeEventListener("abort", handleAbort);
        };
        const handleEnded = () => {
            cleanup();
            resolve();
        };
        const handleError = () => {
            cleanup();
            reject(new Error(`Could not play ${fileName}`));
        };
        const handleAbort = () => {
            audio.pause();
            cleanup();
            reject(new DOMException("Audio playback cancelled", "AbortError"));
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);
        signal.addEventListener("abort", handleAbort, { once: true });
        audio.play().catch((error) => {
            cleanup();
            reject(error);
        });
    });

export const playQueueAnnouncement = async (announcement, signal) => {
    const rollNumber =
        announcement.ticket?.roll_number ?? announcement.roll_number;
    const counterName = announcement.counter?.name ?? announcement.counter_name;
    const rollNumberFiles = getDigitAudioFiles(rollNumber);
    const counterFiles = getDigitAudioFiles(counterName);

    if (rollNumberFiles.length < 1) {
        throw new Error("Announcement does not contain a valid roll number.");
    }

    const files = ["phrase_roll_number.mp3", ...rollNumberFiles];

    if (counterFiles.length > 0) {
        files.push("phrase_to_counter.mp3", ...counterFiles);
    }

    for (const fileName of files) {
        await playAudioFile(fileName, signal);
    }
};

export const unlockQueueAudio = async () => {
    const audio = new Audio(`${AUDIO_BASE_URL}/phrase_roll_number.mp3`);
    audio.muted = true;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
};