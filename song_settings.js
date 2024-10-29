const settingsJson = {
  "labels": {
    "songPrefix": "🎵 Song:",
    "requestedByPrefix": "Requested by:"
  },
  "settings": {
    "theme": "Regular", // (Blood, Camo, Halloween, Pink, Regular or Winter) Default: Regular. # Theme to use.
    "textSize": "1.3rem", // *(px/rem) Default: 1.3rem. # Text size.
    "scrollSpeed": 26, // Default: 26. # How fast text scrolling in seconds.
    "maxTitleLength": 85, // Default: 85. # Max title length to avoid overflow. (Longer gets truncated).
    "enableCleanTitle": true, // (true/false) Default: true. # Removes (Official music video) etc from song title.
    "enableBackgroundShadow": false, // (true/false) Default: false. # Enables shadow background for text.
    "refreshTime": 5 // Default: 5. # How often check if song has changed in seconds.
  }
};