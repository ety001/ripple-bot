const install = (Vue, options = {}) => {
  Vue.Ripple = {
    ping: ws => {
      const pingCommand = {
        'id': 1,
        'command': 'ping'
      }
      ws.send(JSON.stringify(pingCommand))
    },
    pong: component => {

    }
  }
}
export default install
