export const SCHEME = 'saladict-desktop'

export const unlessAppConfigFields = [
  'updateCheck',
  'pdfSniff',
  'pdfWhitelist',
  'pdfBlacklist',
  'searhHistoryInco',
  'baPreload',
  'baAuto',
  'baOpen',
  'whitelist',
  'blacklist',
  'contextMenus',
]

export const DEFAULT_GLOBAL_SHORTCUTS = {
  openSaladict: 'CommandOrControl+Shift+Alt+X',
  // clipboardListen: 'CommandOrControl+Alt+C',
  enableInlineTranslator: 'CommandOrControl+Alt+Shift+Z',
}

export const defaultSalaAppConfig: AppConfig = {
  version: 12,
  active: true,
  analytics: true,
  updateCheck: true,
  noTypeField: false,
  animation: true,
  langCode: 'en',
  panelWidth: 450,
  panelMaxHeightRatio: 80,
  bowlOffsetX: 15,
  bowlOffsetY: -45,
  darkMode: false,
  panelCSS: '',
  fontSize: 13,
  pdfSniff: false,
  pdfWhitelist: [],
  pdfBlacklist: [
    ['^(http|https)://[^/]*?cnki\\.net(/.*)?$', '*://*.cnki.net/*'],
    [
      '^(http|https)://[^/]*?googleusercontent\\.com(/.*)?$',
      '*://*.googleusercontent.com/*',
    ],
  ],
  searhHistory: false,
  searhHistoryInco: false,
  editOnFav: true,
  searchSuggests: true,
  touchMode: false,
  mode: {
    icon: true,
    direct: false,
    double: false,
    holding: { shift: false, ctrl: false, meta: false },
    instant: { enable: false, key: 'alt', delay: 600 },
  },
  pinMode: {
    direct: true,
    double: false,
    holding: { shift: false, ctrl: false, meta: false },
    instant: { enable: false, key: 'alt', delay: 600 },
  },
  panelMode: {
    direct: false,
    double: false,
    holding: { shift: false, ctrl: false, meta: false },
    instant: { enable: false, key: 'alt', delay: 600 },
  },
  qsPanelMode: {
    direct: false,
    double: false,
    holding: { shift: false, ctrl: true, meta: false },
    instant: { enable: false, key: 'alt', delay: 600 },
  },
  bowlHover: true,
  doubleClickDelay: 450,
  tripleCtrl: true,
  tripleCtrlPreload: 'clipboard',
  tripleCtrlAuto: false,
  tripleCtrlLocation: 'CENTER',
  tripleCtrlStandalone: true,
  tripleCtrlHeight: 600,
  tripleCtrlSidebar: '',
  tripleCtrlPageSel: true,
  baPreload: 'clipboard',
  baAuto: false,
  baOpen: 'popup_panel',
  ctxTrans: {
    google: true,
    sogou: true,
    youdaotrans: true,
    baidu: true,
    tencent: false,
    caiyun: false,
  },
  language: {
    chinese: true,
    english: true,
    japanese: true,
    korean: true,
    french: true,
    spanish: true,
    deutsch: true,
    others: false,
    matchAll: false,
  },
  autopron: {
    cn: { dict: '', list: ['zdic', 'guoyu'] },
    en: {
      dict: '',
      list: [
        'bing',
        'cambridge',
        'cobuild',
        'eudic',
        'longman',
        'macmillan',
        'lexico',
        'urban',
        'websterlearner',
        'youdao',
      ],
      accent: 'uk',
    },
    machine: {
      dict: '',
      list: ['google', 'sogou', 'tencent', 'baidu', 'caiyun'],
      src: 'trans',
    },
  },
  whitelist: [],
  blacklist: [
    ['^https://stackedit\\.io(/.*)?$', 'https://stackedit.io/*'],
    ['^https://docs\\.google\\.com(/.*)?$', 'https://docs.google.com/*'],
    ['^https://docs\\.qq\\.com(/.*)?$', 'https://docs.qq.com/*'],
  ],
  contextMenus: {
    selected: ['view_as_pdf', 'google_translate', 'google_search', 'saladict'],
    all: {
      baidu_page_translate: 'x',
      baidu_search: 'https://www.baidu.com/s?ie=utf-8&wd=%s',
      bing_dict: 'https://cn.bing.com/dict/?q=%s',
      bing_search: 'https://www.bing.com/search?q=%s',
      cambridge:
        'http://dictionary.cambridge.org/spellcheck/english-chinese-simplified/?q=%s',
      copy_pdf_url: 'x',
      dictcn: 'https://dict.eudic.net/dicts/en/%s',
      etymonline: 'http://www.etymonline.com/index.php?search=%s',
      google_cn_page_translate: 'x',
      google_page_translate: 'x',
      google_search: 'https://www.google.com/#newwindow=1&q=%s',
      google_translate: 'https://translate.google.cn/#auto/zh-CN/%s',
      guoyu: 'https://www.moedict.tw/%s',
      iciba: 'http://www.iciba.com/%s',
      liangan: 'https://www.moedict.tw/~%s',
      longman_business: 'http://www.ldoceonline.com/search/?q=%s',
      merriam_webster: 'http://www.merriam-webster.com/dictionary/%s',
      microsoft_page_translate: 'x',
      oxford: 'http://www.oxforddictionaries.com/us/definition/english/%s',
      saladict: 'x',
      sogou_page_translate: 'x',
      sogou: 'https://fanyi.sogou.com/#auto/zh-CHS/%s',
      view_as_pdf: 'x',
      youdao_page_translate: 'x',
      youdao: 'http://dict.youdao.com/w/%s',
      youglish: 'https://youglish.com/search/%s',
    },
  },
}
