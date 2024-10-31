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

    loadSettings(currentlyPlayingElement, requestedByElement);
    updateCurrentSong(currentlyPlayingElement, requestedByElement);
});

let maxAllowedTitleLength;

/**
 * Shortens the song title if it exceeds the maximum allowed length and appends an ellipsis.
 *
 * @param {string} title - The original song title.
 * @returns {string} - The possibly shortened song title with an ellipsis if truncated.
 */
function shortTitleLength(title) {
    const omittedTextPostfix = ' […]';
    if (title.length > maxAllowedTitleLength + omittedTextPostfix.length) {
        return title.slice(0, maxAllowedTitleLength) + omittedTextPostfix;
    }

    return title;
}

let enableCleanTitle;
function applySettings(settings, currentlyPlayingElement, requestedByElement) {
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
        document.querySelector('.container').style.animation = 'shadowAnimation 1.5s alternate infinite';
    }

    maxAllowedTitleLength = appSettings.maxTitleLength ?? 85;
    enableCleanTitle = appSettings.enableCleanTitle ?? false;

    const refreshTimeInSeconds = appSettings.refreshTime ?? 5;
    setInterval(updateCurrentSong, refreshTimeInSeconds * 1000);
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

async function loadSettings(currentlyPlayingElement, requestedByElement) {
    try {
        await loadTheme(settingsJson.settings.theme);

        applySettings(settingsJson, currentlyPlayingElement, requestedByElement);
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

async function updateCurrentSong(currentlyPlayingElement, requestedByElement) {
    try {
        const currentSongPath = './current_song.txt';
        const response = await fetch(currentSongPath);
        if (!response.ok) {
            throw new Error(response.statusText);
        } 

        const currentSong = await response.text();
        const match = currentSong.match(/(.+?)\s+- Requested by: (\S+)/);

        if (match && match[2]) {
            const [ , songTitle, nickname ] = match;
            const processedTitle = enableCleanTitle ? cleanTitle(songTitle) : songTitle;
            const finalTitle = shortTitleLength(processedTitle);

            if (currentlyPlayingElement.textContent !== finalTitle) {
                currentlyPlayingElement.textContent = finalTitle;
            }
            if (requestedByElement.textContent !== `@${nickname}`) {
                requestedByElement.textContent = `@${nickname}`;
            }
        }
    } catch (error) {
        console.error('Error fetching the current song:', error);
    }
}