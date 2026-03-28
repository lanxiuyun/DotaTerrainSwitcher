export default {
  // 通用
  common: {
    browse: "浏览",
    execute: "执行切换",
    executing: "执行中...",
    selected: "已选择",
    path: "路径",
    map: "地图",
  },

  // 通知
  notification: {
    successTitle: "操作成功",
    successContent: "当前地图已替换为：{map}",
    failTitle: "地图文件替换失败",
    failContent: "不要在游戏中（如：试玩英雄、天梯、全英雄选择时）替换！",
  },

  // 标题和描述
  header: {
    title: "刀刀小工具",
    subtitle: "Dota 工具箱：地图切换与更多功能，持续更新。",
  },

  about: {
    title: "关于软件",
    versionPrefix: "版本：",
    downloadLink: "下载地址",
    thanksTitle: "致谢",
    checkUpdate: "检查更新",
    checking: "检查中...",
    downloading: "下载中...",
    upToDate: "当前已是最新版本",
    checkError: "检查更新失败，请稍后重试",
    newVersion: "发现新版本",
    newVersionContent: "新版本 {version} 可用，是否现在下载并安装？",
    downloadNow: "立即下载",
    remindLater: "稍后提醒",
    restartRequired: "更新下载完成，重启应用后即可生效",
    downloadError: "下载更新失败，请稍后重试",
  },

  // 设置卡片
  settings: {
    title: "地图切换设置",
    description: "选择地图路径和要切换的地图，然后点击执行按钮。",
    pathLabel:
      "Dota2 根目录（例如：D:\\steam\\steamapps\\common\\dota 2 beta）",
    pathPlaceholder: "例如：D:\\steam\\steamapps\\common\\dota 2 beta",
    mapLabel: "选择地图",
    replaceWarning: "不要在游戏中（如：试玩英雄、天梯、全英雄选择时）替换！",
    dotaRootButton: "选择目录",
  },

  // 地图选项
  maps: {
    default: "默认地图",
    coloseum: "不朽庭院",
    desert: "沙漠地图",
    jungle: "蔓生国度",
    reef: "礁石之界",
    autumn: "秋季地图",
    summer: "夏季地图",
    spring: "春季地图",
    winter: "冬季地图",
    journey: "大圣的新游记",
    crownfall: "皇冠陨落地图",
    ti10: "神圣之地",
    cavern: "玉海之渊",
  },
  // 语言切换
  language: {
    zh: "中文",
    en: "English",
  },

  // 导航
  nav: {
    home: "地图切换",
    alias: "英雄搜索",
    ads: "广告",
    about: "关于",
  },

  alias: {
    title: "英雄搜索设置",
    description:
      "在 Dota2 选英雄界面，用英文快速搜到英雄。",
    warning: "进入游戏后无法修改，如果你不需要自定义英雄搜索，直接点击按钮即可。",
    notifySuccessTitle: "写入成功",
    notifySuccessContent: "英雄搜索关键词已写入游戏文件。",
    notifyFailTitle: "写入失败",
    notifyFailContent: "英雄搜索关键词写入失败，请检查日志。",
    languagePathLabel: "语言目录（默认 dota_schinese，可不改）",
    languagePathPlaceholder: "默认 dota_schinese（一般无需修改）",
    dotaPathLabel: "Dota2 根目录（例如：D:\\steam\\steamapps\\common\\dota 2 beta）",
    dotaPathPlaceholder: "例如：D:\\steam\\steamapps\\common\\dota 2 beta",
    searchLabel: "搜索英雄或关键词",
    searchPlaceholder: "输入英雄名或搜索关键词...",
    tableHero: "英雄",
    tableAliases: "搜索关键词",
    summary: "已设置 {heroes} 个英雄（总数 {total}）。",
    execute: "写入游戏",
    executing: "写入中...",
    logsTitle: "执行日志",
    errors: {
      title: "配置有问题，请先修正：",
      badLine: "第 {line} 行格式错误：需要类似 hero: a,b,c",
      emptyHero: "第 {line} 行英雄名为空",
      emptyAliases: "第 {line} 行 {hero} 的别名为空",
      unknown: "未知错误",
    },
  },
};
