const DB_NAME = 'environmentVariable'
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
          reject(Error)
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
      this.getDataFromDb().then(cb).catch(errorCb)
    },
    postData (url, data, cb, errorCb) {
      this.addDataToDb(data).then(cb).catch(errorCb)
    },
    putData (url, data, cb, errorCb) {
      this.addDataToDb(data).then(cb).catch(errorCb)
    },
    patchData (url, data, cb, errorCb) {
      this.addDataToDb(data).then(cb).catch(errorCb)
    },
    deleteData (url, id, cb, errorCb) {
      this.deleteDataByKey(id).then(cb).catch(errorCb)
    },

    async getDataFromDb () {
      let db = await this.getDb()

      return new Promise(resolve => {
        let trans = db.transaction(['cats'], 'readonly')
        trans.oncomplete = () => {
          resolve(data)
        }

        let store = trans.objectStore('cats')
        let data = []

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result
          if (cursor) {
            data.push(cursor.value)
            cursor.continue()
          }
        }
      })
    },

    async getDataByKey (key) {
      let db = await this.getDb()

      return new Promise(resolve => {
        let trans = db.transaction(['cats'], 'readonly')
        trans.oncomplete = () => {
          resolve(data)
        }

        let data

        let store = db.transaction(['cats'], 'readonly').objectStore('cats')

        store.get(key).onsuccess = e => {
          data = e.target.result.value
        }
      })
    },

    async addDataToDb (data) {
      let db = await this.getDb()

      return new Promise((resolve, reject) => {
        let trans = db.transaction(['cats'], 'readwrite')
        trans.oncomplete = e => {
          resolve(data)
        }

        let store = trans.objectStore('cats')
        if (data.id.length === 0) {
          data.id = data.variable
          store.add(data)
        } else {
          store.delete(data.id)
          data.id = data.variable
          store.add(data)
        }
      })
    },

    async deleteDataByKey (key) {
      let db = await this.getDb()

      return new Promise((resolve, reject) => {
        let trans = db.transaction(['cats'], 'readwrite')
        trans.oncomplete = e => {
          resolve()
        }

        let store = trans.objectStore('cats')
        store.delete(key)
      })
    }
  }
}
