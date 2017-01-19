## Control My Raspberry Pi - App


### About

This is my first polymer-based app (largely influenced by [this tutorial](https://www.youtube.com/watch?v=Tm9tz_vwTTA)) which provides a user interface for controlling the state of individual GPIO pins on your Raspberry Pi.

It is intended to be used in conjunction with [ctrl-my-pi-agent](https://github.com/eriepasquare/ctrl-my-pi-agent) which exposes a REST API that controls the state of the GPIO pins on a Raspberry Pi. It secures the REST endpoint using SSL Client-Authentication compliments of this blog post by Richard, and this example app by nategood.

### Environment Variables
More details and explanation to come...
* PORT
* AGENT_HOST
* AGENT_PORT
* AGENT_SSL_PKCS12_KEY
* AGENT_SSL_PKCS12_PP
* SSL_CA_CERT
* FACEBOOK_APP_ID
* FACEBOOK_APP_SECRET
* FACEBOOK_CALLBACK_URL
* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET
* GOOGLE_CALLBACK
* TWITTER_ID
* TWITTER_SECRET
* TWITTER_CALLBACK
