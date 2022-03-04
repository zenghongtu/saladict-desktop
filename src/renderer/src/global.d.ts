export {}

declare global {
  interface Window {
    /** Expose some Api through preload script */
    bridge: {
      openWindow: (page: string) => void
    }
  }
}
