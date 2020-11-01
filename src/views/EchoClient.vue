<template>
  <div class="container-fluid">

    <!-- Page Heading -->
    <h1 class="h3 mb-4 text-gray-800">Laravel Echo client</h1>

    <div class="row">
    <div class="col-lg-6">
      <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Connect Information</h6>
      </div>

      <div class="card-body">
        <form class="user">
        <div class="form-group">
          <input type="text" class="form-control form-control-user" id="domain"
            v-model="domain" placeholder="Input Your Host">
        </div>
        <div class="form-group">
          <input type="text" class="form-control form-control-user" id="channel"
            v-model="channel" placeholder="Input Your Channel">
        </div>
        <div class="form-group">
          <input type="text" class="form-control form-control-user" id="event"
            v-model="event" placeholder="Input Your Event">
        </div>
        <div class="form-group">
          <input type="password" class="form-control form-control-user" id="token"
            v-model="token" placeholder="Input Your Token">
        </div>

        <div class="form-group row">

          <div class="col-sm-6 mb-3 mb-sm-0">
          <button @click="connectChannel" class="btn btn-primary btn-user btn-block">
            Connect
          </button>
          </div>

          <div class="col-sm-6 mb-3 mb-sm-0">
          <button @click="disconnectChannel" class="btn btn-google btn-user btn-block">
            Disconnect
          </button>
          </div>

        </div>

        </form>
      </div>
      </div>
    </div>

    <div class="col-lg-6">
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
    </div>

  </div>
</template>

<script>
import Echo from 'laravel-echo'

export default {
  name: 'EchoClient',
  data () {
    return {
      message: '',
      list_messages: [],
      domain: '',
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

      window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: this.domain,
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
          this.disconnectChannel();
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
