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
          <input type="text" class="form-control form-control-user" id="domain" placeholder="Input Your Host">
        </div>
        <div class="form-group">
          <input type="text" class="form-control form-control-user" id="channel" placeholder="Input Your Channel">
        </div>
        <div class="form-group">
          <input type="text" class="form-control form-control-user" id="event" placeholder="Input Your Event">
        </div>
        <div class="form-group">
          <input type="password" class="form-control form-control-user" id="token" placeholder="Input Your Token">
        </div>

        <div class="form-group row">

          <div class="col-sm-6 mb-3 mb-sm-0">
          <a href="#" class="btn btn-primary btn-user btn-block">
            Connect
          </a>
          </div>

          <div class="col-sm-6 mb-3 mb-sm-0">
          <a href="index.html" class="btn btn-google btn-user btn-block">
            Disconnect
          </a>
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
      </div>
      </div>
    </div>
    </div>

  </div>
</template>

<script lang='ts'>
import Socket from '@/shared/socket/echo-laravel';

export default {
  name: 'EchoClient',
  data () {
    return {
      message: '',
      list_messages: [],
      domain: '',
      event: '',
      channel: '',
      token: ''
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
      Echo.leave(this.channel);

      this.list_messages = []

      window.Echo = new Echo.constructor({
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

      Echo.join(this.channel)
        .here((users) => {
          this.usersOnline = users
        })
        .listen(this.event, (data) => {
          this.list_messages.unshift(data)
        })

      Echo.connector.socket.on('connect_error', (err) => {
        this.disconnect();
        this.list_messages.unshift({message: 'Error connecting to server'});
      })

      Echo.connector.socket.on('subscription_error', (channel, data) => {
        this.list_messages.unshift({message: 'Authorization fail!'});
      })

      Echo.connector.socket.on('connect', (err) => {
        this.list_messages.unshift({message: 'Connect success'})
      })
    },

    disconnectChannel () {
      Echo.leave(this.channel)
      this.list_messages.unshift({message: 'Leave Channel'})
    }
  }
}

</script>