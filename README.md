# NightbotSR-OBS
 OBS widget for current song.


## Requirements:
  - [NightBot app](https://docs.nightbot.tv/app) installed.
  - [OBS app](https://obsproject.com/download) installed.

## Setup: 
1. Go to the `Documents/Nightbot` folder, or paste this in path: `%USERPROFILE%\Documents\Nightbot`.
  - If using the `Nightbot` app, you should already see a `current_song.txt` file here.
  - Download project as zip, extract all project files.
  - And move them to this folder.
  - The `song.html` file must be __in the same folder__ level as `current_song.txt`.
  - ⚠️ The remaining files and folders be moved here too.
2. Open `OBS` in `Sources` > `Add` (or + sign) > `Browser`;
  - Name it something like a **`Current Song Nightbot`**.
  - Mark as `local file` ✅
  - Click `Browse` & Paste path `%USERPROFILE%\Documents\Nightbot` then choose `song.html` file.
  - __Optional__ height I recommend to set something like `50` for `720p`.
  - Click `ok`.
4. Now it should work.

## Additional features
  Check `song_settings.js` file.

- `theme`: Choose one of the following themes: `regular`, `camo`, `blood`, `halloween`, `winter` or `pink`.

![Regular](screenshots/theme_regular.png) Regular theme.

![Camo theme](screenshots/theme_camo.png) Camo theme.

![Blood theme](screenshots/theme_blood.png) Blood theme.

![Halloween theme](screenshots/theme_halloween.png) Halloween theme.

![Winter theme](screenshots/theme_winter.png) Winter theme.

![Pink theme](screenshots/theme_pink.png) Pink theme.
- `textSize` {`string`}: Font size.
- `scrollSpeed` {`integer`}: Speed of text scrolling, in seconds.
- `maxTitleLength` {`integer`}: Maximum title length before truncation.
- `enableCleanTitle` {`boolean`} (`true`/`false`): Removes tags like "`(Official Music Video)`" and standardizes "`feat.`" to "`ft.`" and "`produced by`" to "`prod.`".
- `enableBackgroundShadow` {`boolean`} (`true`/`false`): Adds background shadow.
- `refreshTime` {`integer`}: Interval (in seconds) to check if the song has changed on disc.

⚠️ **After any changes, double-click the widget name **`Current Song Nightbot`** and select `Refresh cache of current page` to apply.**
