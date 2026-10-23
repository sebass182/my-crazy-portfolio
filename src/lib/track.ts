/* Anonymous usage counts (GoatCounter: no cookies, no IP stored). A click is counted as an event; nothing happens if the script is blocked. */
declare global {
  interface Window {
    goatcounter?: { count?: (v: { path: string; title?: string; event?: boolean }) => void }
  }
}

export function track(name: string) {
  window.goatcounter?.count?.({ path: name, title: name, event: true })
}
