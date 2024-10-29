let scrollTextElement;
let currentlyPlayingElement;
let requestedByElement;
let enableCleanTitle;
let maxAllowedTitleLength;

const regex = /(.+?) - Requested by: ([^\s]+)/;

document.addEventListener('DOMContentLoaded', function() {
    scrollTextElement = document.querySelector('.scrollText');
    currentlyPlayingElement = document.createElement('span');
    requestedByElement = document.createElement('span');

    currentlyPlayingElement.classList.add('song-title');
    requestedByElement.classList.add('nickname');

    const songPrefix = document.createTextNode('🎵 Song: ');
    const requestedByPrefix = document.createTextNode(' Requested by: ');

    scrollTextElement.appendChild(songPrefix);
    scrollTextElement.appendChild(currentlyPlayingElement);
    scrollTextElement.appendChild(requestedByPrefix);
    scrollTextElement.appendChild(requestedByElement);

    loadSettings();
    updateCurrentSong();
});


function shortTitleLength(title) {
    if (title.length > maxAllowedTitleLength + 5) {
        return title.substr(0, maxAllowedTitleLength) + ' […]';
    }
    return title;
}

function cleanTitle(title) {
    title = title.replace(/\bproduced by\b|\bproduced\.\b/gi, 'prod.')
        .replace(/\bfeat\.?\b/gi, 'ft.')
        .replace(/\s*[\[(][^()\[\]]*(Official|Lyric|Music|Video|Audio)[^()\[\]]*[\])]\s*/gi, '');
    return shortTitleLength(title).trim();
}

function applySettings(settings) {
    const { labels, themes, settings: appSettings } = settings;
    const colors = theme.colors;

    document.documentElement.style.setProperty('--text-size', appSettings.textSize);
    document.documentElement.style.setProperty('--gradient-start', colors.gradientStart);
    document.documentElement.style.setProperty('--gradient-end', colors.gradientEnd);
    document.documentElement.style.setProperty('--animation-time', `${appSettings.scrollSpeed || 25}s`);

    currentlyPlayingElement.style.color = colors.songTitle;
    requestedByElement.style.color = colors.nickname;

    if (appSettings.enableBackgroundShadow) {
        const bgShadowColor = colors.backgroundShadow;
        scrollTextElement.style.boxShadow = `inset 0 0 0.5rem 0.1rem ${bgShadowColor}, 0 0 0.8rem 0 ${bgShadowColor}`;
    }

    maxAllowedTitleLength = appSettings.maxTitleLength ?? 85;
    enableCleanTitle = appSettings.enableCleanTitle ?? false;

    const refreshTimeInSeconds = appSettings.refreshTime || 5;
    setInterval(updateCurrentSong, refreshTimeInSeconds * 1000);
}

function loadTheme(themeName) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `./assets/themes/${themeName}.js`;
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
        const response = await fetch('./current_song.txt');
        if (!response.ok) throw new Error(response.statusText);

        const currentSong = await response.text();
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