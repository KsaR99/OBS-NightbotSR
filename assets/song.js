let currentlyPlayingElement;
let requestedByElement;
let enableCleanTitle;
let maxAllowedTitleLength;

document.addEventListener('DOMContentLoaded', function () {
    currentlyPlayingElement = document.createElement('span');
    currentlyPlayingElement.classList.add('song-title');

    requestedByElement = document.createElement('span');
    requestedByElement.classList.add('nickname');

    const songPrefix = document.createTextNode(`${settingsJson.labels.songPrefix} `);
    const requestedByPrefix = document.createTextNode(`\t${settingsJson.labels.requestedByPrefix} `);
    const scrollTextElement = document.querySelector('.scrollText');

    scrollTextElement.append(songPrefix, currentlyPlayingElement, requestedByPrefix, requestedByElement);

    loadSettings();
    updateCurrentSong();
});

function shortTitleLength(title) {
    const ommitedTextPostfix = ' […]';
    if (title.length > maxAllowedTitleLength + ommitedTextPostfix.length) {
        return title.slice(0, maxAllowedTitleLength) + ommitedTextPostfix;
    }

    return title;
}

function cleanTitle(title) {
    title = title.replace(/\bfeat\.?\b/gi, 'ft.')
        .replace(/\bproduced by\b|\bproduced\.\b/gi, 'prod.')
        .replace(/\s*[\[(][^()\[\]]*(Official|Lyric|Music|Video|Audio)[^()\[\]]*[\])]\s*/gi, '');

    return shortTitleLength(title).trim();
}

function applySettings(settings) {
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

async function loadSettings() {
    try {
        await loadTheme(settingsJson.settings.theme.toLowerCase());

        applySettings(settingsJson);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function updateCurrentSong() {
    try {
        const nightbotCurrentSongPath = './current_song.txt';
        const response = await fetch(nightbotCurrentSongPath);
        if (!response.ok) {
            throw new Error(response.statusText);
        } 

        const currentSong = await response.text();
        const regex = /(.+?)\s+- Requested by: ([^\s]+)/;
        const match = currentSong.match(regex);

        if (match && match[2]) {
            const [, songTitle, nickname] = match;
            const processedTitle = enableCleanTitle ? cleanTitle(songTitle) : songTitle;
            const finalTitle = shortTitleLength(processedTitle);

            if (currentlyPlayingElement.innerText !== finalTitle) {
                currentlyPlayingElement.innerText = finalTitle;
            }
            if (requestedByElement.innerText !== `@${nickname}`) {
                requestedByElement.innerText = `@${nickname}`;
            }
        }
    } catch (error) {
        console.error('Error fetching the current song:', error);
    }
}