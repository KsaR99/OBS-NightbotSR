# NightbotSR-OBS
 `OBS` widget for displaying the __current song__ from `Nightbot`.

## Requirements:
  - [NightBot app](https://docs.nightbot.tv/app) installed.
  - [OBS app](https://obsproject.com/download) installed.

## Setup: 
1. **Prepare the Folder**.
  - Go to the `Documents/Nightbot` folder or paste the following in path bar: `%USERPROFILE%\Documents\Nightbot`.
  - If the `Nightbot` app is installed, you should see a file named `current_song.txt` here.
2. **Download & Place Project Files**.
  - Download the project as a zip file, extract it, and move all files into the `Documents\Nightbot` folder.
  - Ensure that `song.html` is in the same directory level as `current_song.txt`.
  - ⚠️ Move all other project files and folders here too.
3. **Add Widget to `OBS`**.
  - Open `OBS` and navigate to `Sources` > `Add` (or press the `+` sign) > `Browser`.
  - Name the new browser source something like **`Current Song Nightbot`**.
  - Enable `local file` ✅
  - Click `Browse` & Paste to path bar `%USERPROFILE%\Documents\Nightbot` then choose `song.html` file.
  - (__Optional__) For a `720p` layout, set the height to `50`.
  - Click `ok` to save.
4. **Test it**.
  - The widget should now display the current song in OBS.
## Additional features
  You can customize settings in `song_settings.js`:

- `theme`: Choose one of the following themes: `regular`, `camo`, `blood`, `halloween`, `winter` or `pink`.

![Regular](screenshots/theme_regular.png) Regular theme.

![Camo theme](screenshots/theme_camo.png) Camo theme.

![Blood theme](screenshots/theme_blood.png) Blood theme.

![Halloween theme](screenshots/theme_halloween.png) Halloween theme.

![Winter theme](screenshots/theme_winter.png) Winter theme.

![Pink theme](screenshots/theme_pink.png) Pink theme.
- `textSize` {`string`}: Define font size.
- `scrollSpeed` {`integer`}: Adjust text scrolling speed, in seconds.
- `maxTitleLength` {`integer`}: Set max title length before truncation.
- `enableCleanTitle` {`boolean`} Set to `true` to clean up tags such as `(Official Music Video)`, and standardize phrases like `feat.` to `ft.` and `produced by` to `prod.`.
- `enableBackgroundShadow` {`boolean`} (`true`/`false`): Add a background shadow by setting to `true`.
- `refreshTime` {`integer`}: Set interval (in seconds) to check if the song has changed on harddrive.

⚠️ Note: After any changes, double-click the widget name in sources **`Current Song Nightbot`** and click `Refresh cache of current page` to apply changes.
