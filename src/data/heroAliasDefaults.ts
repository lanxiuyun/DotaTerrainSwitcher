export type HeroAliasMap = Record<string, string[]>;

type ParsedAliasDefaults = {
  languagePath: string;
  heroes: HeroAliasMap;
};

function parseInlineAliasYaml(text: string): ParsedAliasDefaults {
  let languagePath = "dota_schinese";
  const heroes: HeroAliasMap = {};

  const lines = text.split(/\r?\n/);
  let currentHero = "";
  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;

    if (!raw.startsWith(" ") && trimmed.endsWith(":")) {
      const key = trimmed.slice(0, -1).trim();
      currentHero = key;
      if (currentHero && currentHero !== "path" && !heroes[currentHero]) {
        heroes[currentHero] = [];
      }
      continue;
    }

    if (!raw.startsWith(" ") && trimmed.startsWith("path:")) {
      const value = trimmed.slice("path:".length).trim();
      if (value) languagePath = value;
      currentHero = "";
      continue;
    }

    if (trimmed.startsWith("-")) {
      const value = trimmed.slice(1).trim();
      if (!value) continue;
      if (!currentHero || currentHero === "path") continue;
      if (!heroes[currentHero]) heroes[currentHero] = [];
      heroes[currentHero].push(value);
    }
  }

  return { languagePath, heroes };
}

const inlineYaml = `path: dota_schinese
antimage:
  - antimage
  - dfs
  - difashi
axe:
  - axe
  - fw
  - fuwang
bane:
  - bane
  - tkzy
  - tongkuzhiyuan
  - bn
  - banni
bloodseeker:
  - bloodseeker
  - xm
  - xuemo
crystal_maiden:
  - crystalmaiden
  - sjsn
  - shuijingshinv
  - bn
  - bingnv
drow_ranger:
  - drowranger
  - zeyx
  - zhuoeryouxia
  - hg
  - heigong
  - xh
  - xiaohei
earthshaker:
  - earthshaker
  - hdz
  - handizhe
  - xiaoniu
  - xn
  - shenniu
  - sn
  - niutou
  - nt
juggernaut:
  - juggernaut
  - zz
  - zhuzai
  - js
  - jiansheng
mirana:
  - mirana
  - mln
  - milana
  - bh
  - baihu
nevermore:
  - nevermore
  - ym
  - yingmo
  - nwme
  - naiwenmoer
morphling:
  - morphling
  - btjl
  - biantijingling
  - sr
  - shuiren
phantom_lancer:
  - phantomlancer
  - hycms
  - huanyingchangmaoshou
  - hz
  - houzi
puck:
  - puck
  - pk
  - pake
  - xnl
  - xiannvlong
pudge:
  - pudge
  - pj
  - paji
  - tf
  - tufu
razor:
  - razor
  - lz
  - leize
  - dg
  - diangun
sand_king:
  - sandking
  - sw
  - shawang
  - sk
storm_spirit:
  - stormspirit
  - fbzl
  - fengbaozhiling
  - lm
  - lanmao
sven:
  - sven
  - lljk
  - liulangjianke
  - sw
  - siwen
  - sewen
tiny:
  - tiny
  - xx
  - xiaoxiao
  - sljr
  - shanlingjuren
vengefulspirit:
  - vengefulspirit
  - fczl
  - fuchouzhiling
  - fczh
  - fuchouzhihun
  - vs
windrunner:
  - windrunner
  - fxz
  - fengxingzhe
zuus:
  - zuus
  - zs
  - zhousi
kunkka:
  - kunkka
  - kk
  - kunka
  - cz
  - chuanzhang
lina:
  - ln
  - lina
  - hn
  - huonv
lich:
  - lich
  - wy
  - wuyao
lion:
  - lion
  - le
  - laien
  - emws
  - emowushi
shadow_shaman:
  - shadowshaman
  - aysm
  - anyingsaman
  - xy
  - xiaoy
slardar:
  - slardar
  - sld
  - silada
  - dyr
  - dayuren
tidehunter:
  - tidehunter
  - cxlr
  - chaoxilieren
witch_doctor:
  - witchdoctor
  - wy
  - wuyi
riki:
  - riki
  - lw
  - liwan
  - yc
  - yinci
enigma:
  - enigma
  - mt
  - mituan
tinker:
  - tinker
  - xbj
  - xiubujiang
  - tk
  - tingke
sniper:
  - sniper
  - jjs
  - jujishou
  - hq
  - huoqiang
necrolyte:
  - necrolyte
  - wyfs
  - wenyifashi
  - slfs
  - silingfashi
warlock:
  - warlock
  - ss
  - shushi
beastmaster:
  - beastmaster
  - sw
  - shouwang
queenofpain:
  - queenofpain
  - tknw
  - tongkunvwang
  - nw
  - nvwang
venomancer:
  - venomancer
  - jdss
  - judushushi
faceless_void:
  - facelessvoid
  - xkjm
  - xukongjiamian
  - jbl
  - jibalian
  - theworld
  - zawarudo
  - dio
  - jojo
skeleton_king:
  - skeletonking
  - mhdd
  - minghundadi
  - klw
  - kulouwang
death_prophet:
  - deathprophet
  - swxz
  - siwangxianzhi
  - dp
phantom_assassin:
  - phantomassassin
  - hyck
  - huanyingcike
  - hc
  - huanci
  - pa
pugna:
  - pugna
  - pgn
  - pagena
  - gf
  - gufa
templar_assassin:
  - templarassassin
  - stck
  - shengtangcike
  - ta
viper:
  - viper
  - mjyl
  - mingjieyalong
  - dl
  - dulong
luna:
  - luna
  - ln
  - yq
  - yueqi
dragon_knight:
  - dragonknight
  - lqs
  - longqishi
  - dk
dazzle:
  - dazzle
  - dz
  - daize
  - ayms
  - anyingmushi
rattletrap:
  - rattletrap
  - ftjs
  - fatiaojishi
leshrac:
  - leshrac
  - lxk
  - laxike
  - ll
  - laolu
furion:
  - furion
  - mafurui
  - xz
  - xianzhi
life_stealer:
  - lifestealer
  - shg
  - shihungui
  - xg
  - xiaogou
dark_seer:
  - darkseer
  - haxz
  - heianxianzhe
  - hx
  - heixian
clinkz:
  - clinkz
  - klkz
  - kelingkezi
  - klss
  - kulousheshou
  - xkl
  - xiaokulou
omniknight:
  - omniknight
  - qnqs
  - quannengqishi
  - sqs
  - shengqishi
enchantress:
  - enchantress
  - mhmn
  - meihuomonv
  - xlu
  - xiaolu
huskar:
  - huskar
  - hsk
  - hasika
  - slws
  - shenlingwushi
  - dcws
  - danchewushi
night_stalker:
  - nightstalker
  - aymw
  - anyemowang
  - ym
  - yemo
broodmother:
  - broodmother
  - ymzz
  - yumuzhizhu
  - zz
  - zhizhu
bounty_hunter:
  - bountyhunter
  - sjlr
  - shangjinlieren
weaver:
  - weaver
  - bzz
  - bianzhizhe
  - my
  - mayi
jakiro:
  - jakiro
  - jql
  - jieqiluo
  - stl
  - shuangtoulong
batrider:
  - batrider
  - bfqs
  - bianfuqishi
chen:
  - chen
spectre:
  - spectre
  - yg
  - yougui
doom_bringer:
  - doombringer
  - mrsz
  - morishizhe
ancient_apparition:
  - ancientapparition
  - ygbp
  - yuangubingpo
  - bh
  - binghun
  - bg
  - binggun
  - aa
ursa:
  - ursa
  - xzs
  - xiongzhanshi
spirit_breaker:
  - spiritbreaker
  - lhr
  - liehunren
  - sb
  - shabi
  - bn
  - bainiu
gyrocopter:
  - gyrocopter
  - fj
  - feiji
alchemist:
  - alchemist
  - ljss
  - lianjinshushi
invoker:
  - invoker
  - qqz
  - qiqiuzhe
  - ke
  - kaer
silencer:
  - silencer
  - cmss
  - chenmoshushi
obsidian_destroyer:
  - obsidiandestroyer
  - mjszz
  - mojingshenshizhe
  - hn
  - heiniao
  - od
lycan:
  - lycan
  - lr
  - langren
brewmaster:
  - brewmaster
  - jx
  - jiuxian
  - xmjx
  - xiongmaojiuxian
shadow_demon:
  - shadowdemon
  - ayem
  - anyingemo
  - dg
  - dugou
lone_druid:
  - lonedruid
  - xd
  - xiongde
  - dly
  - deluyi
chaos_knight:
  - chaosknight
  - hdqs
  - hundunqishi
  - ck
meepo:
  - meepo
  - mb
  - mibo
treant:
  - treant
  - sjws
  - shujingweishi
  - ds
  - dashu
ogre_magi:
  - ogremagi
  - srmfs
  - shurenmofashi
  - lp
  - lanpang
undying:
  - undying
  - bxsw
  - buxiushiwang
  - sw
  - shiwang
rubick:
  - rubick
  - lbk
  - labike
  - mds
  - modaoshi
  - fy
  - sg
  - senge
disruptor:
  - disruptor
  - grz
  - ganraozhe
  - se
  - saer
nyx_assassin:
  - nyxassassin
  - dxck
  - dixuecike
  - xq
  - xiaoqiang
naga_siren:
  - nagasiren
  - njhy
  - najiahaiyao
  - xnj
  - xiaonajia
keeper_of_the_light:
  - keeperofthelight
  - gfq
  - guangfa
  - dfs
  - dafashi
wisp:
  - wisp
  - xjl
  - xiaojingling
visage:
  - visage
  - wsj
  - weisaji
  - sxg
  - shixianggui
slark:
  - slark
  - slk
  - silake
  - xyr
  - xiaoyuren
medusa:
  - medusa
  - mds
  - meidusha
  - yj
  - yijie
  - sy
  - sheyao
troll_warlord:
  - trollwarlord
  - jmzj
  - jumozhanjiang
centaur:
  - centaur
  - brm
  - banrenma
  - rm
  - renma
magnataur:
  - magnataur
  - magenasi
  - mgns
  - mm
  - mengma
  - ban
shredder:
  - shredder
  - fmj
  - famuji
  - hmj
  - huamuji
bristleback:
  - bristleback
  - gbs
  - gangbeishou
  - gbz
  - gangbeizhu
  - zhu
tusk:
  - tusk
  - jyhm
  - juyahaimin
  - hm
  - haimin
skywrath_mage:
  - skywrathmage
  - tnfs
  - tiannufashi
  - nr
  - niaoren
  - gzfs
  - gezifashi
abaddon:
  - abaddon
  - ybd
  - yabadun
  - swqs
  - siwangqishi
  - dk
  - aess
  - aersasi
elder_titan:
  - eldertitan
  - sgjs
  - shanggujushen
  - daniu
  - dn
legion_commander:
  - legioncommander
  - jtzjg
  - juntuanzhihuiguan
ember_spirit:
  - emberspirit
  - hjzl
  - huijinzhiling
  - hm
  - huomao
earth_spirit:
  - earthspirit
  - ddzl
  - dadizhiling
  - tm
  - tumao
terrorblade:
  - terrorblade
  - kblr
  - kongbuliren
  - tb
phoenix:
  - phoenix
  - fh
  - fenghuang
oracle:
  - oracle
  - syz
  - shenyuzhe
techies:
  - techies
  - gcs
  - gongchengshi
  - zdr
  - zhadanren
winter_wyvern:
  - winterwyvern
  - hdfl
  - handongfeilong
  - bl
  - binglong
arc_warden:
  - arcwarden
  - tqswz
  - tianqiongshouwangzhe
  - hgswz
  - huguangshouwangzhe
  - dg
  - diangou
abyssal_underlord:
  - abyssalunderlord
  - nz
  - niezhu
  - dpg
  - dapigu
monkey_king:
  - monkeyking
  - qtds
  - qitiandasheng
  - ds
  - dasheng
  - swk
  - sunwukong
pangolier:
  - pangolier
  - sljs
  - shilinjianshi
  - gg
  - gungun
dark_willow:
  - darkwillow
  - xyfl
  - xieyingfangling
  - xxn
  - xiaoxiannv
grimstroke:
  - grimstroke
  - tym
  - tianyamoke
  - mk
  - moke
mars:
  - mars
  - mes
  - maersi
  - zsjs
  - zhanshen
void_spirit:
  - voidspirit
  - xwzl
  - xuwuzhiling
  - zm
  - zimao
snapfire:
  - snapfire
  - dyjs
  - dianyanjueshou
  - lnn
  - laonainai
hoodwink:
  - hoodwink
  - xss
  - xiaosongshu
  - ss
  - songshu
dawnbreaker:
  - dawnbreaker
  - pxcx
  - poxiaochenxing
  - dc
  - dachui
  - db
marci:
  - marci
  - mx
  - maxi
  - nq
  - nvquan
primal_beast:
  - primal_beast
  - s
  - shou
muerta:
  - muerta
  - qybl
  - qiongyingbiling
  - qb
  - qiongbi
  - lnn
  - laonainai
ringmaster:
  - ringmaster
  - bxdw
  - baixidawang
  - xss
  - xunshoushi
  - xc
  - xiaochou
kez:
  - kez
  - kz
  - kai
  - nr
  - niaoren
largo:
  - largo
  - langge
  - lg
  - qingwa
  - qw
`;

const parsed = parseInlineAliasYaml(inlineYaml);

export const defaultLanguagePath = parsed.languagePath;
export const defaultHeroAliases: HeroAliasMap = parsed.heroes;

export const heroChineseNames: Record<string, string> = {
  antimage: "敌法师",
  axe: "斧王",
  bane: "痛苦之源",
  bloodseeker: "血魔",
  crystal_maiden: "水晶室女",
  drow_ranger: "卓尔游侠",
  earthshaker: "撼地者",
  juggernaut: "主宰",
  mirana: "米拉娜",
  nevermore: "影魔",
  morphling: "变体精灵",
  phantom_lancer: "幻影长矛手",
  puck: "帕克",
  pudge: "帕吉",
  razor: "雷泽",
  sand_king: "沙王",
  storm_spirit: "风暴之灵",
  sven: "斯温",
  tiny: "小小",
  vengefulspirit: "复仇之魂",
  windrunner: "风行者",
  zuus: "宙斯",
  kunkka: "昆卡",
  lina: "莉娜",
  lich: "巫妖",
  lion: "莱恩",
  shadow_shaman: "暗影萨满",
  slardar: "斯拉达",
  tidehunter: "潮汐猎人",
  witch_doctor: "巫医",
  riki: "力丸",
  enigma: "谜团",
  tinker: "修补匠",
  sniper: "狙击手",
  necrolyte: "瘟疫法师",
  warlock: "术士",
  beastmaster: "兽王",
  queenofpain: "痛苦女王",
  venomancer: "剧毒术士",
  faceless_void: "虚空假面",
  skeleton_king: "骷髅王",
  death_prophet: "死亡先知",
  phantom_assassin: "幻影刺客",
  pugna: "帕格纳",
  templar_assassin: "圣堂刺客",
  viper: "冥界亚龙",
  luna: "露娜",
  dragon_knight: "龙骑士",
  dazzle: "戴泽",
  rattletrap: "发条技师",
  leshrac: "拉席克",
  furion: "先知",
  life_stealer: "噬魂鬼",
  dark_seer: "黑暗贤者",
  clinkz: "克林克兹",
  omniknight: "全能骑士",
  enchantress: "魅惑魔女",
  huskar: "哈斯卡",
  night_stalker: "暗夜魔王",
  broodmother: "育母蜘蛛",
  bounty_hunter: "赏金猎人",
  weaver: "编织者",
  jakiro: "杰奇洛",
  batrider: "蝙蝠骑士",
  chen: "陈",
  spectre: "幽鬼",
  doom_bringer: "末日使者",
  ancient_apparition: "远古冰魄",
  ursa: "熊战士",
  spirit_breaker: "裂魂人",
  gyrocopter: "矮人直升机",
  alchemist: "炼金术士",
  invoker: "祈求者",
  silencer: "沉默术士",
  obsidian_destroyer: "黑曜毁灭者",
  lycan: "狼人",
  brewmaster: "酒仙",
  shadow_demon: "暗影恶魔",
  lone_druid: "孤行德鲁伊",
  chaos_knight: "混沌骑士",
  meepo: "米波",
  treant: "树精卫士",
  ogre_magi: "食人魔法师",
  undying: "不朽尸王",
  rubick: "拉比克",
  disruptor: "干扰者",
  nyx_assassin: "地穴刺客",
  naga_siren: "娜迦海妖",
  keeper_of_the_light: "光之守卫",
  wisp: "艾欧",
  visage: "维萨吉",
  slark: "斯拉克",
  medusa: "美杜莎",
  troll_warlord: "巨魔战将",
  centaur: "半人马战行者",
  magnataur: "马格纳斯",
  shredder: "伐木机",
  bristleback: "刚背兽",
  tusk: "巨牙海民",
  skywrath_mage: "天怒法师",
  abaddon: "亚巴顿",
  elder_titan: "上古巨神",
  legion_commander: "军团指挥官",
  ember_spirit: "灰烬之灵",
  earth_spirit: "大地之灵",
  terrorblade: "恐怖利刃",
  phoenix: "凤凰",
  oracle: "神谕者",
  techies: "工程师",
  winter_wyvern: "寒冬飞龙",
  arc_warden: "天穹守望者",
  abyssal_underlord: "深渊领主",
  monkey_king: "齐天大圣",
  pangolier: "石鳞剑士",
  dark_willow: "邪影芳灵",
  grimstroke: "天涯墨客",
  mars: "玛尔斯",
  void_spirit: "虚无之灵",
  snapfire: "电炎绝手",
  hoodwink: "森海飞霞",
  dawnbreaker: "破晓辰星",
  marci: "玛西",
  primal_beast: "兽",
  muerta: "穆艾塔",
  ringmaster: "马戏团长",
  kez: "科兹",
  largo: "朗戈",
};

