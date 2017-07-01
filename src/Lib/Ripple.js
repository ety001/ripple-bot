const install = (Vue, options = {}) => {
  Vue.Ripple = {
    ping: ws => {
      const pingCommand = {
        'id': 1,
        'command': 'ping'
      }
      ws.send(JSON.stringify(pingCommand))
    },
    pong: (component, data) => {
      if (data.status !== 'success') {
        component.ws.close()
      }
    },
    sellOrderBook: (ws, component, limit = 10) => {
      let command = {
        'id': 12,
        'command': 'book_offers',
        'taker': component.myAddress,
        'taker_gets': {
          'currency': 'XRP'
        },
        'taker_pays': {
          'currency': 'CNY',
          'issuer': component.gateway
        },
        'limit': limit
      }
      ws.send(JSON.stringify(command))
    },
    buyOrderBook: (ws, component, limit = 10) => {
      let command = {
        'id': 12,
        'command': 'book_offers',
        'taker': component.myAddress,
        'taker_gets': {
          'currency': 'CNY',
          'issuer': component.gateway
        },
        'taker_pays': {
          'currency': 'XRP'
        },
        'limit': limit
      }
      ws.send(JSON.stringify(command))
    },
    subscribeBooks: (ws, component) => {
      let command = {
        'id': 'xrp_cny_order_book',
        'command': 'subscribe',
        'books': [
          {
            'taker_pays': {
              'currency': 'XRP'
            },
            'taker_gets': {
              'currency': 'CNY',
              'issuer': component.gateway
            },
            'snapshot': true,
            'both': true
          }
        ]
      }
      ws.send(JSON.stringify(command))
    },
    unsubscribeBooks: (ws, component) => {
      let command = {
        'id': 'xrp_cny_order_book',
        'command': 'subscribe',
        'books': [
          {
            'taker_pays': {
              'currency': 'XRP'
            },
            'taker_gets': {
              'currency': 'CNY',
              'issuer': component.gateway
            },
            'snapshot': true,
            'both': true
          }
        ]
      }
      ws.send(JSON.stringify(command))
    }
  }
}
export default install
