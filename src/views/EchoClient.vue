<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Connect Information</h6>
          </div>

          <div class="card-body">
            <div class="user">
              <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                  <vue-simple-suggest
                    v-model="channel"
                    placeholder="Input Your Channel"
                    :styles="autoCompleteStyle"
                    :list='getSuggestionList("echo-client-channel")'
                    :filter-by-query="true">
                  </vue-simple-suggest>
                </div>

                <div class="col-sm-6">
                  <vue-simple-suggest
                    v-model="event"
                    placeholder="Input Your Event"
                    :styles="autoCompleteStyle"
                    :list='getSuggestionList("echo-client-event")'
                    :filter-by-query="true">
                  </vue-simple-suggest>
                </div>
              </div>

              <div class="form-group row">
                <div class="col-sm-6">
                    <input type="text" class="default-input form-control" id="token"
                      v-model="token" placeholder="Input Your Token" name="token">
                </div>

                <div class="col-sm-6 mb-3 mb-sm-0 row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <button @click="connectChannel" class="btn btn-primary btn-user btn-block">
                      Connect
                    </button>
                  </div>

                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <button @click="disconnectChannel" class="btn btn-google btn-user btn-block">
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Socket Response</h6>
          </div>

          <div class="card-body">
            <div class="column">
              <pre v-html="prettyAreaData" size="100"></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Your History</h6>
          </div>

          <div class="card-body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Echo from 'laravel-echo'
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css'
import EventBus from '@/shared/event-bus'
import Requests from '../_mixins/requests'

window.io = require('socket.io-client')

export default {
  name: 'EchoClient',
  mixins: [Requests],
  components: {
    VueSimpleSuggest
  },
  data () {
    return {
      message: '',
      domain: '',
      list_messages: [],
      event: '',
      channel: '',
      token: '',
      broadcaster: '',
      is_error: false,
      autoCompleteStyle: {
        defaultInput: 'form-control'
      }
    }
  },

  mounted () {
    EventBus.$on('saveCollection', (res) => {
      console.log(res.this)
      const _this = this
      _this.saveCollection()
    })

    EventBus.$on('connectServer', (res) => {
      console.log(res.this)
      const _this = this
      _this.connectServer()
    })

    EventBus.$on('initEventData', (res) => {
      const _this = this
      _this.initEventData(res)
    })
  },
  computed: {
    prettyAreaData: function () {
      let json = JSON.stringify(this.list_messages, null, 2)
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    }
  },
  methods: {
    async handleEnv(str) {
      let strConverted = str
      let envRegex = /\{{([^{}]*)\}}/g
      let matches = str.match(envRegex)
      
      if (matches !== null) {
        for (var i = 0; i < matches.length; i++) {
          var envStr = matches[i].replace(/{|}/g,'');
          var value = await this.getDataByKey(envStr);
          strConverted = strConverted.replace(matches[i], value)
        }
      }

      return strConverted
    },

    async connectServer () {
      let domain = await this.handleEnv(this.$parent.domain);

      window.Echo = new Echo({
        broadcaster: this.$parent.broadcaster,
        host: domain,
        reconnection: true,
        reconnectionAttempts: 3,
        transports: ['websocket']
      })

      window.Echo.connector.socket.on('connect_error', (err) => {
        if (err) {
          console.log(err)
        } else {
          this.list_messages.unshift({message: 'Error connecting to server'})
        }
      })

      window.Echo.connector.socket.on('connect', (err) => {
        if (err) {
          console.log(err)
        } else {
          this.list_messages.unshift({message: 'Connect success'})
        }
      })

      window.Echo.connector.socket.on('subscription_error', (channel, data) => {
        this.list_messages.unshift({message: 'Authorization fail!'})
      })
    },

    async connectChannel () {
      this.list_messages = []
      let domain = await this.handleEnv(this.$parent.domain)
      let channel = await this.handleEnv(this.channel)
      let event = await this.handleEnv(this.event)

      if (typeof window.Echo !== 'undefined') {
        window.Echo.leave(channel)
      }

      window.Echo = new Echo({
        broadcaster: this.$parent.broadcaster,
        host: domain,
        reconnection: true,
        reconnectionAttempts: 3,
        transports: ['websocket'],
        auth:
        {
          headers:
          {
            'Authorization': this.token
          }
        }
      })

      window.Echo.channel(channel).listen(event, (data) => {
        this.list_messages.unshift(data)
      })

      window.Echo.connector.socket.on('connect_error', (err) => {
        if (err) {
          console.log(err)
        } else {
          this.list_messages.unshift({message: 'Error connecting to server'})
        }
      })

      window.Echo.connector.socket.on('connect', (err) => {
        if (err) {
          console.log(err)
        } else {
          this.list_messages.unshift({message: 'Connect success'})
        }
      })

      window.Echo.connector.socket.on('subscription_error', (channel, data) => {
        this.list_messages.unshift({message: 'Authorization fail!'})
      })

      this.updateSuggestionList('echo-client-channel', this.channel)
      this.updateSuggestionList('echo-client-event', this.event)
    },

    disconnectChannel () {
      window.Echo.leave(this.channel)
      this.list_messages.unshift({message: 'Leave Channel'})
    },

    updateSuggestionList (storageKey, data) {
      this.putDataToList(storageKey, data)
    },

    getSuggestionList (storageKey) {
      return JSON.parse(localStorage.getItem(storageKey))
    },

    saveCollection () {
      // TODO: replace local storage by API
      let collectionKey = 'collection_domain'
      let collectionName = this.$parent.domain
      let event = this.event
      let eventData = {}
      eventData['domain'] = this.$parent.domain
      eventData['broadcaster'] = this.$parent.broadcaster
      eventData['channel'] = this.channel
      eventData['event'] = event
      eventData['token'] = this.token

      this.putDataToList(collectionKey, collectionName)
      this.putDataToList(collectionName, event)
      localStorage.setItem(event, JSON.stringify(eventData))

      this.$emit('add-new', true)
    },

    putDataToList (storageKey, data) {
      let list = []

      if (localStorage.getItem(storageKey) !== undefined) {
        list = JSON.parse(localStorage.getItem(storageKey))
        if (list === null) {
          list = []
        }
      }

      if (!list.includes(data)) {
        list.push(data)
      }

      localStorage.setItem(storageKey, JSON.stringify(list))
    },

    initEventData (eventData) {
      this.channel = eventData.channel
      this.event = eventData.event
      this.token = eventData.token
    },

    beforeDestroy () {
      EventBus.$off('saveCollection')
      EventBus.$off('connectServer')
    }
  }
}

</script>

<style>
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; text-align: left; font-size: initial;}
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
  .column {
    float: left;
    width: 100%;
  }
  /* Clear floats after the columns */
  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  .z-1000 {
    z-index: 1000;
  }

  .hover {
    background-color: #007bff;
    color: #fff;
  }
</style>
