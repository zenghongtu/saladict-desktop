import fs from 'fs'
import http, { Server } from 'http'
import finalhandler from 'finalhandler'
import serveStatic from 'serve-static'
import { ipcMain, app } from 'electron'
import path from 'path'
import { AddressInfo } from 'net'
import * as url from 'url'

let server: Server | null = null

let appPath = app.getAppPath()

const initServe = (): Promise<AddressInfo | null> => {
  const serve = serveStatic(appPath, {
    index: 'iframe.html',
    maxAge: 48 * 60 * 60 * 1e3,
  })

  return new Promise((resolve, reject) => {
    server = http
      .createServer(function onRequest(req, res) {
        const { pathname, query } = url.parse(req.url || '', true)
        const { redirect, word, direct } = query

        if (
          pathname &&
          pathname.endsWith('.html') &&
          // !pathname.startsWith('iframe.html') &&
          !direct &&
          !redirect
        ) {
          const location = url.format({
            pathname: 'iframe.html',
            query: { ...query, redirect: pathname.slice(1) },
          })

          const Location = location

          res.writeHead(301, {
            Location,
          })

          return res.end()
        }
        // @ts-ignore
        serve(req, res, finalhandler(req, res))
      })
      .listen(0, '127.0.0.1', () => {
        const address = server?.address()
        if (!address) {
          return resolve(null)
        }
        resolve(address as AddressInfo)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

export default initServe
