process.env.NODE_ENV = 'development'

import { readFileSync } from 'fs'
import { resolve, join } from 'path'
import electron from 'electron'
import { spawn } from 'child_process'
import { createServer, build as viteBuild } from 'vite'

const pkg = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
)

/**
 * @param {{ name: string; configFile: string; writeBundle: import('rollup').OutputPlugin['writeBundle'] }} param0
 * @returns {import('rollup').RollupWatcher}
 */
function getWatcher({ name, configFile, writeBundle }) {
  return viteBuild({
    // Options here precedence over configFile
    mode: process.env.NODE_ENV,
    build: {
      watch: {},
    },
    configFile,
    plugins: [{ name, writeBundle }],
  })
}

/**
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchMain() {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null

  /**
   * @type {import('rollup').RollupWatcher}
   */
  const watcher = await getWatcher({
    name: 'electron-main-watcher',
    configFile: 'configs/vite.main.ts',
    writeBundle() {
      electronProcess && electronProcess.kill()
      electronProcess = spawn(electron, ['.'], {
        stdio: 'inherit',
        env: Object.assign(process.env, pkg.env),
      })
    },
  })

  return watcher
}

/**
 * @param {import('vite').ViteDevServer} viteDevServer
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchPreload(viteDevServer) {
  return getWatcher({
    name: 'electron-preload-watcher',
    configFile: 'configs/vite.preload.ts',
    writeBundle() {
      viteDevServer.ws.send({
        type: 'full-reload',
      })
    },
  })
}

async function watchSaladict(viteDevServer) {
  return getWatcher({
    name: 'saladict-watcher',
    configFile: 'configs/vite.saladict.ts',
    writeBundle() {
      viteDevServer.ws.send({
        type: 'full-reload',
      })
    },
  })
}

// bootstrap
const viteDevServer = await createServer({
  configFile: 'configs/vite.renderer.ts',
})

await viteDevServer.listen()
await watchSaladict(viteDevServer)
await watchPreload(viteDevServer)
await watchMain()
