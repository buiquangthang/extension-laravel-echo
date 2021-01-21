import axios from 'axios'
import { error } from 'shelljs'

const DB_NAME = 'catdb'
const DB_VERSION = 1
let DB

export default {
  methods: {
    async getDb () {
      return new Promise((resolve, reject) => {
        if (DB) { return resolve(DB) }
        console.log('OPENING DB', DB)
        let request = window.indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = e => {
          console.log('Error opening db', e)
          reject('Error')
        }

        request.onsuccess = e => {
          DB = e.target.result
          resolve(DB)
        }

        request.onupgradeneeded = e => {
          console.log('onupgradeneeded')
          let db = e.target.result
          db.createObjectStore('cats', { autoIncrement: true, keyPath: 'id' })
        }
      })
    },
    getData (url, cb, errorCb) {
      // axios.get(url).then(cb).catch(errorCb)
      this.getCats().then(cb).catch(errorCb)
    },
    postData (url, data, cb, errorCb) {
      // axios.post(url, data).then(cb).catch(errorCb)
      (new Promise((resolve, reject) => {
        let trans = this.db.transaction(['cats'], 'readwrite')
        trans.oncomplete = e => {
          resolve()
        }

        let store = trans.objectStore('cats')
        store.add(data)
      })).then(cb).catch(errorCb)
    },
    putData (url, data, cb, errorCb) {
      axios.put(url, data).then(cb).catch(errorCb)
    },
    patchData (url, data, cb, errorCb) {
      axios.patch(url, data).then(cb).catch(errorCb)
    },
    deleteData (url, cb, errorCb) {
      axios.delete(url).then(cb).catch(errorCb)
    },

    async getCats () {
      let db = await this.getDb()

      return new Promise(resolve => {
        let trans = db.transaction(['cats'], 'readonly')
        trans.oncomplete = () => {
          resolve(cats)
        }

        let store = trans.objectStore('cats')
        let cats = []

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result
          if (cursor) {
            cats.push(cursor.value)
            cursor.continue()
          }
        }
      })
    }
  }
}
