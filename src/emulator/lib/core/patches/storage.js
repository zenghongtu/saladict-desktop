import _ from 'lodash'

const storageData = Symbol.for('fake_env_storageData')

window[storageData] = {
  local: {},
  sync: {},
  managed: {},
  listeners: []
}

window.browser.storage.onChanged.addListener = listener => {
  if (!_.isFunction(listener)) {
    return Promise.reject(new TypeError('Wrong argument type'))
  }
  if (!window[storageData].listeners.some(x => x === listener)) {
    window[storageData].listeners.push(listener)
  }
}
window.browser.storage.onChanged.removeListener = listener => {
  if (!_.isFunction(listener)) {
    return Promise.reject(new TypeError('Wrong argument type'))
  }
  window[storageData].listeners = window[storageData].listeners.filter(
    x => x !== listener
  )
}
window.browser.storage.onChanged.hasListener = listener => {
  if (!_.isFunction(listener)) {
    return Promise.reject(new TypeError('Wrong argument type'))
  }
  window[storageData].listeners.some(x => x === listener)
}

genStorageApis('sync')
genStorageApis('local')
genStorageApis('managed')

function genStorageApis (area) {
  window.browser.storage[area].get.callsFake(keys => {
    if (keys == null) {
      return Promise.resolve(_.cloneDeep(window[storageData][area]))
    }

    if (_.isString(keys)) {
      if (!keys) {
        return Promise.resolve({})
      }
      keys = [keys]
    } else if (_.isArray(keys)) {
      if (keys.length <= 0) {
        return Promise.resolve({})
      }
    } else if (_.isObject(keys)) {
      keys = Object.keys(keys)
      if (keys.length <= 0) {
        return Promise.resolve({})
      }
    } else {
      return Promise.reject(new TypeError('Wrong argument type'))
    }

    return Promise.resolve(_.pick(_.cloneDeep(window[storageData][area]), keys))
  })

  window.browser.storage[area].set.callsFake(data => {
    if (!_.isObject(data)) {
      return Promise.reject(new TypeError('Argument 1 should be an object'))
    }

    try {
      // deep clone & check data
      data = JSON.parse(JSON.stringify(data))
    } catch (err) {
      return Promise.reject(new TypeError('Data not serializable'))
    }

    const newData = _.assign({}, window[storageData][area], data)
    const changedItems = Object.keys(data).filter(
      k => !_.isEqual(newData[k], window[storageData][area][k])
    )

    if (changedItems.length > 0) {
      const changes = changedItems.reduce((x, k) => {
        x[k] = {
          newValue: _.cloneDeep(newData[k]),
          oldValue: _.cloneDeep(window[storageData][area][k])
        }
        return x
      }, {})
      setTimeout(() => notifyListeners(changes, area), 0)
    }

    window[storageData][area] = newData
    return Promise.resolve()
  })

  window.browser.storage[area].remove.callsFake(keys => {
    if (_.isString(keys)) {
      keys = keys ? [keys] : []
    } else if (!_.isArray(keys)) {
      return Promise.reject(new TypeError('Wrong argument type'))
    }

    const newData = _.omit(window[storageData][area], keys)
    const changedItems = keys.filter(
      k => !_.isUndefined(window[storageData][area][k])
    )

    if (changedItems.length > 0) {
      const changes = changedItems.reduce((x, k) => {
        x[k] = {
          newValue: void 0,
          oldValue: _.cloneDeep(window[storageData][area][k])
        }
        return x
      }, {})
      setTimeout(() => notifyListeners(changes, area), 0)
    }

    window[storageData][area] = newData
    return Promise.resolve()
  })

  window.browser.storage[area].clear.callsFake(() => {
    const changedItems = Object.keys(window[storageData][area]).filter(
      k => !_.isUndefined(window[storageData][area][k])
    )

    if (changedItems.length > 0) {
      const changes = changedItems.reduce((x, k) => {
        x[k] = {
          newValue: void 0,
          oldValue: _.cloneDeep(window[storageData][area][k])
        }
        return x
      }, {})
      setTimeout(() => notifyListeners(changes, area), 0)
    }

    window[storageData][area] = {}
    return Promise.resolve()
  })

  window.browser.storage[area].getBytesInUse.callsFake(keys => {
    if (_.isNull(keys)) {
      return Promise.resolve(
        new Blob([JSON.stringify(window[storageData][area])]).size
      )
    }

    if (_.isString(keys)) {
      keys = keys ? [keys] : []
    } else if (!_.isArray(keys)) {
      return Promise.reject(new TypeError('Wrong argument type'))
    }

    if (keys.length <= 0) {
      return Promise.resolve(0)
    }

    return Promise.resolve(
      new Blob([JSON.stringify(_.pick(window[storageData][area], keys))]).size
    )
  })
}

function notifyListeners (changes, area) {
  window[storageData].listeners.forEach(listener =>
    listener(_.cloneDeep(changes), area)
  )
}
