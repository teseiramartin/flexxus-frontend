import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const projectRoot = new URL('../', import.meta.url)

test('genera una SPA de Vite con un punto de montaje React', async () => {
  const html = await readFile(new URL('dist/index.html', projectRoot), 'utf8')

  assert.match(html, /<div id="root"><\/div>/)
  assert.match(html, /<title>Flexxus BI \| Libro IVA Ventas<\/title>/)
  assert.match(html, /<script[^>]+type="module"[^>]+src="\/assets\//)
  assert.doesNotMatch(html, /vinext|_next|cloudflare/i)
})

test('incluye el fallback SPA para Cloudflare Pages', async () => {
  const redirects = await readFile(new URL('dist/_redirects', projectRoot), 'utf8')
  assert.equal(redirects.trim(), '/* /index.html 200')
})
