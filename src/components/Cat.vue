<template>
  <div class="chat">
    <h2>Laravel Echo Client</h2>
    <div class="row">
      <div class="column">
        <img src="http://thecatapi.com/api/images/get?format=src&type=gif">

        <p>
          <input type="text" v-model="domain" placeholder="Input your domain" size="50" />
        </p>

        <p>
          <input type="text" v-model="channel" placeholder="Input your channel" size="50" />
        </p>

        <p>
          <input type="text" v-model="event" placeholder="Input your event" size="50" />
        </p>

        <p>
          <input type="text" v-model="token" placeholder="Bearer XXX" size="50" />
        </p>

        <!-- <input type="text" v-model="message" placeholder="add new message here" /> -->
        <button @click="connectChannel" class="btn btn-primary btn-sm">Connect</button>
        <button @click="disconnectChannel" class="btn btn-primary btn-sm">Disconnect</button>
      </div>

      <div class="column">
        <pre v-html="prettyAreaData" size="100"></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cat',
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
      window.Echo.disconnect()
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

        // Echo.connector.socket.on('connect_error', (err) => {
        //   this.disconnect();
        //   this.list_messages.unshift({message: 'Error connecting to server'});
        // })

        // Echo.connector.socket.on('subscription_error', (channel, data) => {
        //   this.list_messages.unshift({message: 'Authorization fail!'});
        // })

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

<style>
pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; text-align: left; font-size: initial;}
.string { color: green; }
.number { color: darkorange; }
.boolean { color: blue; }
.null { color: magenta; }
.key { color: red; }
.column {
  float: left;
  width: 50%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
