export default {
  // Common
  common: {
    browse: "Browse",
    execute: "Execute Switch",
    executing: "Executing...",
    selected: "Selected",
    path: "Path",
    map: "Map",
  },

  // Notifications
  notification: {
    successTitle: "Success",
    successContent: "Current terrain has been replaced with: {map}",
    failTitle: "Failed to replace terrain file",
    failContent:
      "Do not replace during the game (e.g., trial hero, ladder, full hero selection).",
  },

  // Header and description
  header: {
    title: "Daodao Tool",
  },

  about: {
    title: "About",
    versionPrefix: "Version:",
    downloadLink: "Download Link",
    thanksTitle: "Acknowledgements",
    checkUpdate: "Check Update",
    checking: "Checking...",
    downloading: "Downloading...",
    upToDate: "You're up to date",
    checkError: "Failed to check for updates, please try again later",
    newVersion: "New Version Available",
    newVersionContent: "Version {version} is available. Download and install now?",
    downloadNow: "Download Now",
    remindLater: "Remind Me Later",
    restartRequired: "Update downloaded. Restart to apply.",
    downloadError: "Failed to download update, please try again later",
  },

  // Settings card
  settings: {
    title: "Terrain Switch Settings",
    description:
      "Select the map path and the terrain to switch to, then click the execute button.",
    pathLabel:
      "Dota2 Root Folder (e.g., D:\\steam\\steamapps\\common\\dota 2 beta)",
    pathPlaceholder: "e.g., D:\\steam\\steamapps\\common\\dota 2 beta",
    mapLabel: "Select Terrain",
    replaceWarning:
      "Do not replace during the game (e.g., trial hero, ladder, full hero selection).",
    dotaRootButton: "Select Directory",
  },

  // Map options
  maps: {
    default: "Default Terrain",
    coloseum: "Colosseum",
    desert: "Desert Terrain",
    jungle: "Jungle Realm",
    reef: "Reef Boundary",
    autumn: "Autumn Terrain",
    summer: "Summer Terrain",
    spring: "Spring Terrain",
    winter: "Winter Terrain",
    journey: "Monkey King's New Journey",
    crownfall: "Crownfall Terrain",
    ti10: "Sacred Ground",
    cavern: "Jade Sea Abyss",
  },

  // Thanks section
  thanks: {
    title: "Special Thanks",
    dotaMods: "Dota 2 Terrain Mods",
    v0: "v0 for page design",
    naiveUI: "NaiveUI components",
    cursor: "cursor editor",
    trae: "trae editor",
  },

  // Language switching
  language: {
    zh: "中文",
    en: "English",
  },

  // Navigation
  nav: {
    home: "Switcher",
    alias: "Hero Search",
    ads: "Ads",
    about: "About",
  },

  alias: {
    title: "Hero Search Settings",
    description:
      "Quickly find heroes on the Dota2 selection screen using English input.",
    warning: "Cannot modify after entering the game.",
    notifySuccessTitle: "Written",
    notifySuccessContent: "Hero search keywords were written to game files.",
    notifyFailTitle: "Write failed",
    notifyFailContent: "Failed to write hero search keywords. Check the logs.",
    languagePathLabel: "Language folder (default dota_schinese, optional)",
    languagePathPlaceholder: "Default is dota_schinese (usually no change)",
    dotaPathLabel: "Dota2 root folder",
    dotaPathPlaceholder: "e.g., D:\\steam\\steamapps\\common\\dota 2 beta",
    searchLabel: "Search hero or keyword",
    searchPlaceholder: "Type hero name or search keyword...",
    tableHero: "Hero",
    tableAliases: "Search Keywords",
    summary: "Configured {heroes} heroes (total {total}).",
    execute: "Write to Game",
    executing: "Writing...",
    logsTitle: "Logs",
    errors: {
      title: "Please fix these issues first:",
      badLine: "Line {line} format invalid: expected hero: a,b,c",
      emptyHero: "Line {line} hero name is empty",
      emptyAliases: "Line {line} aliases for {hero} are empty",
      unknown: "Unknown error",
    },
  },
};
