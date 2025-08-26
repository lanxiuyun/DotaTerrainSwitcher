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
  header: {
    title: string;
    subtitle: string;
  };
  settings: {
    title: string;
    description: string;
    pathLabel: string;
    pathPlaceholder: string;
    mapLabel: string;
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
}
