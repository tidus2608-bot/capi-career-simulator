import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
})

globalThis.document = dom.window.document
globalThis.window = dom.window as unknown as Window & typeof globalThis
globalThis.navigator = dom.window.navigator
globalThis.HTMLInputElement = dom.window.HTMLInputElement
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Element = dom.window.Element
globalThis.Node = dom.window.Node
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const { expect, afterEach } = await import('bun:test')
const matchers = await import('@testing-library/jest-dom/matchers')
const { cleanup } = await import('@testing-library/react')

expect.extend(matchers.default || matchers)

afterEach(() => {
  cleanup()
})
