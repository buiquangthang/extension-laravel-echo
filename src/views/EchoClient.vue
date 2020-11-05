<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Connect Information</h6>
        </div>

        <div class="card-body">
          <form class="user" v-on:submit.prevent="connectChannel" autocomplete="on">
            <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                  <input type="text" class="form-control" id="channel"
                    v-model="channel" placeholder="Input Your Channel" name="channel">
              </div>

              <div class="col-sm-6">
                  <input type="text" class="form-control" id="event"
                    v-model="event" placeholder="Input Your Event" name="event">
              </div>
            </div>

            <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                <select class="form-control" id="broadcaster" placeholder="">
                  <option selected>Choose broadcaster</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>

              <div class="col-sm-6">
                  <input type="password" class="form-control" id="token"
                    v-model="token" placeholder="Input Your Token" name="token">
              </div>
            </div>

            <div class="form-group row">

              <div class="col-sm-6 mb-3 mb-sm-0">
                <input type="submit" value="Listen" class="btn btn-primary btn-user btn-block"></input>
              </div>

              <div class="col-sm-6 mb-3 mb-sm-0">
                <button @click="disconnectChannel" class="btn btn-google btn-user btn-block">
                  Leave
                </button>
              </div>

            </div>

          </form>
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

            <div class="card-body">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Echo from 'laravel-echo'
window.io = require('socket.io-client')

export default {
  name: 'EchoClient',
  data () {
    return {
      message: '',
      domain: '',
      list_messages: [],
      event: '',
      channel: '',
      token: '',
      is_error: false
    }
  },
  created () {},
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
    connectChannel () {
      this.list_messages = []
      this.is_error = false
      this.domain = this.$parent.domain

      if (typeof window.Echo !== "undefined") {
        window.Echo.disconnect()
      }

      window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: this.domain,
        reconnection: true,
        reconnectionAttempts: 3,
        auth:
            {
              headers:
              {
                'Authorization': this.token
              }
            }
      })

      window.Echo.connector.socket.on('connect_error', (err) => {
        if (!this.is_error) {
          this.is_error = true
          this.list_messages.unshift({message: 'Error connecting to server'});
        }
      })

      window.Echo.connector.socket.on('subscription_error', (channel, data) => {
        this.list_messages.unshift({message: 'Authorization fail!'});
      })

      window.Echo.connector.socket.on('connect', (err) => {
        this.is_error = false
        this.list_messages.unshift({message: 'Connect success'})
      })
    },

    disconnectChannel () {
      window.Echo.leave(this.channel)
      this.list_messages.unshift({message: 'Leave Channel'})
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
</style>
