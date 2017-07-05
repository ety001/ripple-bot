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
            'snapshot': false,
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
    getBooks: (component, bookType) => {
      let command = {}
      if (bookType === 'buy') {
        command = {
          'id': 'buy_book',
          'command': 'book_offers',
          'taker': component.myAddress,
          'taker_gets': {
            'currency': 'XRP'
          },
          'taker_pays': {
            'currency': 'CNY',
            'issuer': component.gateway
          },
          'limit': 11
        }
      } else if (bookType === 'sell') {
        command = {
          'id': 'sell_book',
          'command': 'book_offers',
          'taker': component.myAddress,
          'taker_gets': {
            'currency': 'CNY',
            'issuer': component.gateway
          },
          'taker_pays': {
            'currency': 'XRP'
          },
          'limit': 10
        }
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
    },
    updateBalance: (component, address) => {
      let command = {
        'id': 'update_balance',
        'command': 'account_info',
        'account': address
      }
      component.ws.send(JSON.stringify(command))
    },
    updateAccountLine: (component, address) => {
      let command = {
        'id': 'account_line',
        'command': 'account_lines',
        'account': address,
        'ledger': 'current'
      }
      component.ws.send(JSON.stringify(command))
    },
    getAccountOffers: (component, flag = 'account_offer') => {
      let command = {
        'id': flag,
        'command': 'account_offers',
        'account': component.myAddress,
        'ledger': 'current'
      }
      component.ws.send(JSON.stringify(command))
    },
    orderCreate: (component, orderType = 'buy', takerGets, takerPays) => {
      let command = {
        'id': 'order_create_' + orderType,
        'command': 'submit',
        'tx_json': {
          'TransactionType': 'OfferCreate',
          'Account': component.myAddress,
          'Fee': 12,
          'Flags': 0,
          'LastLedgerSequence': component.ledgerSequence++,
          'Sequence': component.sequence++,
          'TakerGets': takerGets,
          'TakerPays': takerPays
        },
        'secret': component.primaryKey,
        'offline': false,
        'fee_mult_max': 1000
      }
      component.ws.send(JSON.stringify(command))
    },
    orderCancel: (component, sequence) => {
      let command = {
        'id': 'order_cancel',
        'command': 'submit',
        'tx_json': {
          'TransactionType': 'OfferCancel',
          'Account': component.myAddress,
          'Fee': '12',
          'Flags': 0,
          'LastLedgerSequence': component.ledgerSequence++,
          'OfferSequence': sequence,
          'Sequence': component.sequence++
        },
        'secret': component.primaryKey,
        'offline': false,
        'fee_mult_max': 1000
      }
      component.ws.send(JSON.stringify(command))
    }
  }
}
export default install
