document.addEventListener('DOMContentLoaded', function () {
    let currentlyPlayingElement = document.createElement('span');
    currentlyPlayingElement.classList.add('song-title');

    const requestedByElement = document.createElement('span');
    requestedByElement.classList.add('nickname');

    const { songPrefix, requestedByPrefix } = settingsJson.labels;

    const songPrefixNode = document.createTextNode(`${songPrefix} `);
    const requestedByPrefixNode = document.createTextNode(`\t${requestedByPrefix} `);
    const scrollTextElement = document.querySelector('.scrollText');

    scrollTextElement.append(songPrefix, currentlyPlayingElement, requestedByPrefix, requestedByElement);

    loadSettings(scrollTextElement, currentlyPlayingElement, requestedByElement);
    updateCurrentSong(scrollTextElement, currentlyPlayingElement, requestedByElement);
});

let maxAllowedTitleLength;
let enableCleanTitle;
let lastUpdateTime = Date.now();
let lastTitle = '';
let lastNickname = '';

/**
 * Shortens the song title if it exceeds the maximum allowed length and appends an ellipsis.
 *
 * @param {string} title - The original song title.
 * @returns {string} - The possibly shortened song title with an ellipsis if truncated.
 */
function shortTitleLength(title) {
    const omittedTextPostfix = ' […]';
    const titleExceedsLength = title.length > maxAllowedTitleLength + omittedTextPostfix.length;
    if (titleExceedsLength) {
        return title.slice(0, maxAllowedTitleLength) + omittedTextPostfix;
    }

    return title;
}

function applySettings(settings, scrollTextElement, currentlyPlayingElement, requestedByElement) {
    const { settings: appSettings } = settings;

    const colors = theme.colors;
    const rootStyle = document.documentElement.style;

    rootStyle.setProperty('--text-size', appSettings.textSize);
    rootStyle.setProperty('--gradient-start', colors.gradientStart);
    rootStyle.setProperty('--gradient-end', colors.gradientEnd);
    rootStyle.setProperty('--animation-time', `${appSettings.scrollSpeed || 25}s`);

    currentlyPlayingElement.style.color = colors.songTitle;
    requestedByElement.style.color = colors.nickname;

    if (appSettings.enableBackgroundShadow) {
        rootStyle.setProperty('--bgShadowColor', colors.backgroundShadow);

        document.querySelector('.container').classList.add('enableShadowAnimation');
    }

    maxAllowedTitleLength = appSettings.maxTitleLength ?? 85;
    enableCleanTitle = appSettings.enableCleanTitle ?? false;

    const refreshTimeInSeconds = appSettings.refreshTime ?? 5;
    setInterval(() => updateCurrentSong(scrollTextElement, currentlyPlayingElement, requestedByElement), refreshTimeInSeconds * 1000);
}

function loadTheme(themeName) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `./assets/themes/${themeName.toLowerCase()}.js`;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load theme.'));

        const settingsScript = document.querySelector('script[src="./assets/song.js"]');
        document.head.insertBefore(script, settingsScript);
    });
}

async function loadSettings(scrollTextElement, currentlyPlayingElement, requestedByElement) {
    try {
        await loadTheme(settingsJson.settings.theme);

        applySettings(
            settingsJson,
            scrollTextElement,
            currentlyPlayingElement,
            requestedByElement
        );
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Cleans the song title by replacing common terms with abbreviations
 * and removing unnecessary text like "Official Lyric Video".
 *
 * @param {string} title - The original song title.
 * @returns {string} - The cleaned and possibly shortened song title.
 */
function cleanTitle(title) {
    return shortTitleLength(
        title.replace(/\bfeat\.?\b|\bfeaturing \b/gi, 'ft.')
            .replace(/\bproduced by\b/gi, 'prod.')
            .replace(/\s*[\[(][^()\[\]]*(Official|Lyric|Music|Video|Audio)[^()\[\]]*[\])]\s*/gi, '')
    ).trim();
}

function updateOpacity(scrollTextElement, lastUpdateTime) {
    const currentTime = Date.now();
    const maxSongDisplayTimeMs = (10 * 60) * 1000 + 6;
    const elapsedTimeMs = currentTime - lastUpdateTime;
    const shouldBeDimmed = elapsedTimeMs >= maxSongDisplayTimeMs;
    if (shouldBeDimmed) {
        scrollTextElement.classList.add('scrollText--dimmed');
    } else {
        scrollTextElement.classList.remove('scrollText--dimmed');
    }
}

async function updateCurrentSong(scrollTextElement, currentlyPlayingElement, requestedByElement) {
    try {
        const currentSongPath = './current_song.txt';
        const response = await fetch(currentSongPath);
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const currentSong = await response.text();
        const match = currentSong.match(/(.+?)\s+- Requested by: (\S+)/);

        if (match && match[2]) {
            const [, songTitle, nickname] = match;
            const processedTitle = enableCleanTitle ? cleanTitle(songTitle) : songTitle;
            const finalTitle = shortTitleLength(processedTitle);

            const isNewSong = finalTitle !== lastTitle || nickname !== lastNickname;
            if (isNewSong) {
                lastUpdateTime = Date.now();
                lastTitle = finalTitle;
                lastNickname = nickname;
            }

            const titleChanged = currentlyPlayingElement.textContent !== finalTitle;
            if (titleChanged) {
                currentlyPlayingElement.textContent = finalTitle;
            }

            const nicknameChanged = requestedByElement.textContent !== `@${nickname}`;
            if (nicknameChanged) {
                requestedByElement.textContent = `@${nickname}`;
            }

            updateOpacity(scrollTextElement, lastUpdateTime);
        }
    } catch (error) {
        console.error('Error fetching the current song:', error);
    }
}