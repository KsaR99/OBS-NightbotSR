# NightbotSR-OBS
 OBS widget for current song.


## Requirements:
  - [NightBot app](https://docs.nightbot.tv/app) installed.
  - [OBS app](https://obsproject.com/download) installed.

## Setup: 
1. Go into folder `Documents/Nightbot` or paste this in path: `%USERPROFILE%\Documents\Nightbot`.
  > Right there (if you using `Nightbot` app) should be already file `current_song.txt`.

  > Extract here all files.
2. Open `OBS` in `Sources` > `Add` (or + sign) > `Browser`;
  > Name it something like a `Current Song Nightbot`.

  > Mark as `local file` ✅

  > Click `Browse` & Paste path `%USERPROFILE%\Documents\Nightbot` then choose `song.html` file.

  > height I recommend to set something like `50` for `720p`.

  > Click `ok`.
4. Now should work.

## Additional features
  > check `song_settings.js` file.

- `theme` One from themes to use. `regular`, `camo`, `blood`, `halloween`, `pink`, `winter`.

![Regular](screenshots/theme_regular.png) regular theme.

![Camo theme](screenshots/theme_camo.png) camo theme.

![Blood theme](screenshots/theme_blood.png) blood theme.

![Halloween theme](screenshots/theme_halloween.png) halloween theme.

![Winter theme](screenshots/theme_winter.png) winter theme.

![Pink theme](screenshots/theme_pink.png) pink theme.
- `textSize` Font size. Recommended `1.3rem`
- `scrollSpeed` How quick text scrolling in seconds, recommended `25`.
- `maxTitleLength` Length after which title is truncated to not overflow too much. Recommended `85`.
- `enableCleanTitle` boolean `true` or `false`; Removes all "`(Official music video)`" tags from title.
and changes some "`feat.`" to "`ft.`", "`produced by`" to "`prod.`"
- `enableBackgroundShadow` boolean `true`/`false`, Enables some extra shadow.
- `refreshTime` How often check if next song changed on disc. `5` seconds recommended.

  > After any changes done double click on widget name `Current Song Nightbot` > `Refresh cache of current page` to apply changes.
