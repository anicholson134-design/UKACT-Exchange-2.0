declare module 'plotly.js-geo-dist-min' {
  const Plotly: {
    newPlot: (root: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => Promise<unknown>
    relayout: (root: HTMLElement, update: Record<string, unknown>) => Promise<unknown>
    purge: (root: HTMLElement) => void
    [key: string]: unknown
  }
  export default Plotly
}
