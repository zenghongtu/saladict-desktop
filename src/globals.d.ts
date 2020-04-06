/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

const __static: string

interface ShareVars extends AppConfig {
  isPinPanel: boolean
}

declare namespace NodeJS {
  interface Global {
    __static: string
    shareVars: ShareVars
  }
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  >>

  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare type LangCode = 'zh-CN' | 'zh-TW' | 'en'
declare type TCDirection =
  | 'CENTER'
  | 'TOP'
  | 'RIGHT'
  | 'BOTTOM'
  | 'LEFT'
  | 'TOP_LEFT'
  | 'TOP_RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT'
declare type InstantSearchKey = 'direct' | 'ctrl' | 'alt' | 'shift'
declare type PreloadSource = '' | 'clipboard' | 'selection'

interface AppConfig {
  version: number
  /** activate app, won't affect triple-ctrl setting */
  active: boolean
  /** enable Google analytics */
  analytics: boolean
  /** enable update check */
  updateCheck: boolean
  /** disable selection on type fields, like input and textarea */
  noTypeField: boolean
  /** use animation for transition */
  animation: boolean
  /** language code for locales */
  langCode: LangCode
  /** panel width */
  panelWidth: number
  /** panel max height in percentage, 0 < n < 100 */
  panelMaxHeightRatio: number
  bowlOffsetX: number
  bowlOffsetY: number
  darkMode: boolean
  /** custom panel css */
  panelCSS: string
  /** panel font-size */
  fontSize: number
  /** sniff pdf request */
  pdfSniff: boolean
  /** URLs, [regexp.source, match_pattern] */
  pdfWhitelist: [string, string][]
  /** URLs, [regexp.source, match_pattern] */
  pdfBlacklist: [string, string][]
  /** track search history */
  searhHistory: boolean
  /** incognito mode */
  searhHistoryInco: boolean
  /** open word editor when adding a word to notebook */
  editOnFav: boolean
  /** Show suggestions when typing on search box */
  searchSuggests: boolean
  /** Enable touch related support */
  touchMode: boolean
  /** when and how to search text */
  mode: {
    /** show pop icon first */
    icon: boolean
    /** how panel directly */
    direct: boolean
    /** double click */
    double: boolean
    /** holding a key */
    holding: {
      shift: boolean
      ctrl: boolean
      meta: boolean
    }
    /** cursor instant capture */
    instant: {
      enable: boolean
      key: InstantSearchKey
      delay: number
    }
  }
  /** when and how to search text if the panel is pinned */
  pinMode: {
    /** direct: on mouseup */
    direct: boolean
    /** double: double click */
    double: boolean
    /** holding a key */
    holding: {
      shift: boolean
      ctrl: boolean
      meta: boolean
    }
    /** cursor instant capture */
    instant: {
      enable: boolean
      key: InstantSearchKey
      delay: number
    }
  }
  /** when and how to search text inside dict panel */
  panelMode: {
    /** direct: on mouseup */
    direct: boolean
    /** double: double click */
    double: boolean
    /** holding a key */
    holding: {
      shift: boolean
      ctrl: boolean
      meta: boolean
    }
    /** cursor instant capture */
    instant: {
      enable: boolean
      key: InstantSearchKey
      delay: number
    }
  }
  /** when this is a quick search standalone panel running */
  qsPanelMode: {
    /** direct: on mouseup */
    direct: boolean
    /** double: double click */
    double: boolean
    /** holding a key */
    holding: {
      shift: boolean
      ctrl: boolean
      meta: boolean
    }
    /** cursor instant capture */
    instant: {
      enable: boolean
      key: InstantSearchKey
      delay: number
    }
  }
  /** hover instead of click */
  bowlHover: boolean
  /** double click delay, in ms */
  doubleClickDelay: number
  /** show panel when triple press ctrl */
  tripleCtrl: boolean
  /** preload source */
  tripleCtrlPreload: PreloadSource
  /** auto search when triple hit ctrl */
  tripleCtrlAuto: boolean
  /** where should the dict appears */
  tripleCtrlLocation: TCDirection
  /** should panel be in a standalone window */
  tripleCtrlStandalone: boolean
  /** standalone panel height */
  tripleCtrlHeight: number
  /** resize main widnow to leave space to standalone window */
  tripleCtrlSidebar: GamepadHand
  /** should standalone panel response to page selection */
  tripleCtrlPageSel: boolean
  /** browser action panel preload source */
  baPreload: PreloadSource
  /** auto search when browser action panel shows */
  baAuto: boolean
  /**
   * browser action behavior
   * 'popup_panel' - show dict panel
   * 'popup_fav' - add selection to notebook
   * 'popup_options' - opten options
   * 'popup_standalone' - open standalone panel
   * others are same as context menus
   */
  baOpen: string
  /** context tranlate engines */
  ctxTrans: {
    google: boolean
    sogou: boolean
    youdaotrans: boolean
    baidu: boolean
    tencent: boolean
    caiyun: boolean
  }
  /** start searching when source containing the languages */
  language: any
  /** auto pronunciation */
  autopron: {
    cn: {
      dict:
        | ''
        | 'baidu'
        | 'bing'
        | 'caiyun'
        | 'cambridge'
        | 'cnki'
        | 'cobuild'
        | 'etymonline'
        | 'eudic'
        | 'google'
        | 'googledict'
        | 'guoyu'
        | 'hjdict'
        | 'jukuu'
        | 'lexico'
        | 'liangan'
        | 'longman'
        | 'macmillan'
        | 'mojidict'
        | 'naver'
        | 'renren'
        | 'shanbay'
        | 'sogou'
        | 'tencent'
        | 'urban'
        | 'vocabulary'
        | 'weblio'
        | 'weblioejje'
        | 'websterlearner'
        | 'wikipedia'
        | 'youdao'
        | 'youdaotrans'
        | 'zdic'
      list: (
        | 'baidu'
        | 'bing'
        | 'caiyun'
        | 'cambridge'
        | 'cnki'
        | 'cobuild'
        | 'etymonline'
        | 'eudic'
        | 'google'
        | 'googledict'
        | 'guoyu'
        | 'hjdict'
        | 'jukuu'
        | 'lexico'
        | 'liangan'
        | 'longman'
        | 'macmillan'
        | 'mojidict'
        | 'naver'
        | 'renren'
        | 'shanbay'
        | 'sogou'
        | 'tencent'
        | 'urban'
        | 'vocabulary'
        | 'weblio'
        | 'weblioejje'
        | 'websterlearner'
        | 'wikipedia'
        | 'youdao'
        | 'youdaotrans'
        | 'zdic'
      )[]
    }
    en: {
      dict:
        | ''
        | 'baidu'
        | 'bing'
        | 'caiyun'
        | 'cambridge'
        | 'cnki'
        | 'cobuild'
        | 'etymonline'
        | 'eudic'
        | 'google'
        | 'googledict'
        | 'guoyu'
        | 'hjdict'
        | 'jukuu'
        | 'lexico'
        | 'liangan'
        | 'longman'
        | 'macmillan'
        | 'mojidict'
        | 'naver'
        | 'renren'
        | 'shanbay'
        | 'sogou'
        | 'tencent'
        | 'urban'
        | 'vocabulary'
        | 'weblio'
        | 'weblioejje'
        | 'websterlearner'
        | 'wikipedia'
        | 'youdao'
        | 'youdaotrans'
        | 'zdic'
      list: (
        | 'baidu'
        | 'bing'
        | 'caiyun'
        | 'cambridge'
        | 'cnki'
        | 'cobuild'
        | 'etymonline'
        | 'eudic'
        | 'google'
        | 'googledict'
        | 'guoyu'
        | 'hjdict'
        | 'jukuu'
        | 'lexico'
        | 'liangan'
        | 'longman'
        | 'macmillan'
        | 'mojidict'
        | 'naver'
        | 'renren'
        | 'shanbay'
        | 'sogou'
        | 'tencent'
        | 'urban'
        | 'vocabulary'
        | 'weblio'
        | 'weblioejje'
        | 'websterlearner'
        | 'wikipedia'
        | 'youdao'
        | 'youdaotrans'
        | 'zdic'
      )[]
      accent: 'uk' | 'us'
    }
    machine: {
      dict:
        | ''
        | 'baidu'
        | 'bing'
        | 'caiyun'
        | 'cambridge'
        | 'cnki'
        | 'cobuild'
        | 'etymonline'
        | 'eudic'
        | 'google'
        | 'googledict'
        | 'guoyu'
        | 'hjdict'
        | 'jukuu'
        | 'lexico'
        | 'liangan'
        | 'longman'
        | 'macmillan'
        | 'mojidict'
        | 'naver'
        | 'renren'
        | 'shanbay'
        | 'sogou'
        | 'tencent'
        | 'urban'
        | 'vocabulary'
        | 'weblio'
        | 'weblioejje'
        | 'websterlearner'
        | 'wikipedia'
        | 'youdao'
        | 'youdaotrans'
        | 'zdic'
      list: string[]
      src: 'trans' | 'searchText'
    }
  }
  /** URLs, [regexp.source, match_pattern] */
  whitelist: [string, string][]
  /** URLs, [regexp.source, match_pattern] */
  blacklist: [string, string][]
  contextMenus: {
    selected: string[]
    all: {
      baidu_page_translate: string
      baidu_search: string
      bing_dict: string
      bing_search: string
      cambridge: string
      copy_pdf_url: string
      dictcn: string
      etymonline: string
      google_cn_page_translate: string
      google_page_translate: string
      google_search: string
      google_translate: string
      guoyu: string
      iciba: string
      liangan: string
      longman_business: string
      merriam_webster: string
      microsoft_page_translate: string
      oxford: string
      saladict: string
      sogou_page_translate: string
      sogou: string
      view_as_pdf: string
      youdao_page_translate: string
      youdao: string
      youglish: string
    } & {
      [index: string]: any
    }
  }
}

declare namespace mitt {
  type Handler = (event?: any) => void
  type WildcardHandler = (type?: string, event?: any) => void

  interface MittStatic {
    (all?: { [key: string]: Array<Handler> }): Emitter
  }

  interface Emitter {
    /**
     * Register an event handler for the given type.
     *
     * @param {string} type Type of event to listen for, or `"*"` for all events.
     * @param {Handler} handler Function to call in response to the given event.
     *
     * @memberOf Mitt
     */
    on(type: keyof ShareVars, handler: Handler): void
    on(type: '*', handler: WildcardHandler): void

    /**
     * Function to call in response to the given event
     *
     * @param {string} type Type of event to unregister `handler` from, or `"*"`
     * @param {Handler} handler Handler function to remove.
     *
     * @memberOf Mitt
     */
    off(type: keyof ShareVars, handler: Handler): void
    off(type: '*', handler: WildcardHandler): void

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked prior to type-matched handlers.
     *
     * @param {string} type The event type to invoke
     * @param {any} [event] An event object, passed to each handler
     *
     * @memberOf Mitt
     */
    emit(type: keyof ShareVars, event?: any): void
  }
}
