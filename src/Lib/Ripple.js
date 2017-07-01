const install = (Vue, options = {}) => {
  Vue.Ripple = {
    ping: ws => {
      const pingCommand = {
        'id': 'ping_pong',
        'command': 'ping'
      }
      ws.send(JSON.stringify(pingCommand))
    },
    pong: (component, data) => {
      if (data.status !== 'success') {
        component.ws.close()
      }
    },
    sellOrderBook: (component, limit = 10) => {
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
      component.ws.send(JSON.stringify(command))
    },
    buyOrderBook: (component, limit = 10) => {
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
      component.ws.send(JSON.stringify(command))
    },
    subscribeBooks: (component) => {
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
      component.ws.send(JSON.stringify(command))
    },
    unsubscribeBooks: (component) => {
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
      component.ws.send(JSON.stringify(command))
    },
    txStatus: (component, transaction) => {
      let command = {
        'id': 'tx_status',
        'command': 'tx',
        'transaction': transaction,
        'binary': false
      }
      component.ws.send(JSON.stringify(command))
    }
  }
}
export default install
