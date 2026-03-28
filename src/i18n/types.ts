// i18n 类型声明
export interface LocaleOption {
  code: string;
  name: string;
}

export interface I18nMessages {
  common: {
    browse: string;
    execute: string;
    executing: string;
    selected: string;
    path: string;
    map: string;
  };
  notification: {
    successTitle: string;
    successContent: string;
    failTitle: string;
    failContent: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    versionPrefix: string;
    downloadLink: string;
    thanksTitle: string;
    checkUpdate: string;
    checking: string;
    downloading: string;
    upToDate: string;
    checkError: string;
    newVersion: string;
    newVersionContent: string;
    downloadNow: string;
    remindLater: string;
    restartRequired: string;
    downloadError: string;
  };
  settings: {
    title: string;
    description: string;
    pathLabel: string;
    pathPlaceholder: string;
    mapLabel: string;
    replaceWarning: string;
    dotaRootButton: string;
  };
  maps: {
    default: string;
    coloseum: string;
    desert: string;
    jungle: string;
    reef: string;
    autumn: string;
    summer: string;
    spring: string;
    winter: string;
    journey: string;
    crownfall: string;
    ti10: string;
    cavern: string;
  };
  alias: {
    title: string;
    description: string;
    warning: string;
    notifySuccessTitle: string;
    notifySuccessContent: string;
    notifyFailTitle: string;
    notifyFailContent: string;
    languagePathLabel: string;
    languagePathPlaceholder: string;
    dotaPathLabel: string;
    dotaPathPlaceholder: string;
    searchLabel: string;
    searchPlaceholder: string;
    tableHero: string;
    tableAliases: string;
    summary: string;
    execute: string;
    executing: string;
    logsTitle: string;
    errors: {
      title: string;
      badLine: string;
      emptyHero: string;
      emptyAliases: string;
      unknown: string;
    };
  };
  thanks: {
    title: string;
    dotaMods: string;
    v0: string;
    naiveUI: string;
    cursor: string;
    trae: string;
  };
  language: {
    zh: string;
    en: string;
  };
  nav: {
    home: string;
    alias: string;
    ads: string;
    about: string;
  };
}
