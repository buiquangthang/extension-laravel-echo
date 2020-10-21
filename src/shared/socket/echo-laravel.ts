import Echo from 'laravel-echo';
import 'socket.io-client';

window.io = require('socket.io-client');

export interface EchoOption {
    broadcaster: string;
    host: string;
    auth: {
        headers: {
            Authorization: string;
            Accept: string;
            ContentType: string;
        };
    };
    transports: string[];
}

export default {
    initEcho(opts: EchoOption) {
        window.Echo = new Echo(opts);
    },

    echoPrivate(channel: string) {
        return window.Echo.private(channel);
    },

    leaveChannel(channel: string) {
        window.Echo.leave(channel);
    },

    joinChannel(channel: string) {
        return window.Echo.channel(channel);
    }
}