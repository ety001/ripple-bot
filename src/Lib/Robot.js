const install = (Vue, options = {}) => {
  const drops = 1000000
  Vue.Robot = {
    run: (component, Ripple) => {
      if (component.robotStatus === true) {
        // check offers
        let orders = component.orders
        let [maxCNY,
          maxXRP,
          currentCNY,
          currentXRP,
          buyRate,
          sellRate] =
          [component.limitCNY,
            component.limitXRP,
            component.myCNY,
            component.myXRP,
            component.buyRate,
            component.sellRate]
        let price = component.price
        // 还没有获取到价格
        if (price <= 0) {
          return
        }
        // 计算买入卖出价格
        let buyPrice = price * (1 - buyRate / 100)
        let sellPrice = price * (1 + sellRate / 100)
        let orderTotal = component.orderTotal
        if (orders.length === 0) {
          // orders 为空则触发创建买卖订单
          // console.log('create two order')
          // 如果当前xrp数量小于阈值，则下买单
          if (currentXRP < maxXRP) {
            Vue.Robot.orderCreate(component, Ripple, 'buy', orderTotal / buyPrice, orderTotal)
          }
          // 如果当前cny数量小于阈值，则下卖单
          if (currentCNY < maxCNY) {
            Vue.Robot.orderCreate(component, Ripple, 'sell', orderTotal, orderTotal / sellPrice)
          }
        } else {
          // orders 不为空需要判断旧订单是否需要取消
          let [buyOfferNum, sellOfferNum] = [0, 0]
          let offersLength = orders.length
          orders.forEach((val, index, arr) => {
            // console.log(val.seq)
            if (val.order_type === 'sell') {
              // sell xrp order
              let offerPrice = parseFloat(val.price)
              if (component.fixNum(price * (1 + sellRate / 100), 3) < offerPrice) {
                // cancel this offer
                // console.log('sellRate', component.fixNum(price * (1 + sellRate / 100), 3), offerPrice)
                Ripple.orderCancel(component, parseInt(val.seq))
              } else {
                sellOfferNum++
              }
            } else if (val.order_type === 'buy') {
              // buy xrp order
              let offerPrice = parseFloat(val.price)
              if (component.fixNum(price * (1 - (buyRate + 1) / 100), 3) > offerPrice) {
                // cancel this offer
                // console.log('buyRate', component.fixNum(price * (1 - (buyRate + 1) / 100), 3), offerPrice)
                Ripple.orderCancel(component, parseInt(val.seq))
              } else {
                buyOfferNum++
              }
            }
            if (index === offersLength - 1) {
              if (buyOfferNum === 0) {
                // 如果当前xrp数量小于阈值，则下买单
                if (currentXRP < maxXRP) {
                  Vue.Robot.orderCreate(component, Ripple, 'buy', orderTotal / buyPrice, orderTotal)
                }
              }
              if (sellOfferNum === 0) {
                // 如果当前cny数量小于阈值，则下卖单
                if (currentCNY < maxCNY) {
                  Vue.Robot.orderCreate(component, Ripple, 'sell', orderTotal, orderTotal / sellPrice)
                }
              }
            }
          })
        }
      }
    },
    orderCreate: (component, Ripple, orderType, buyNum, sellNum) => {
      let [takerPays, takerGets] = [null, null]
      if (orderType === 'buy') {
        // buy xrp
        takerGets = {
          'currency': 'CNY',
          'issuer': component.gateway,
          'value': sellNum
        }
        takerPays = parseInt(buyNum * drops)
      } else if (orderType === 'sell') {
        // sell xrp
        takerGets = parseInt(sellNum * drops)
        takerPays = {
          'currency': 'CNY',
          'issuer': component.gateway,
          'value': buyNum
        }
      }
      Ripple.orderCreate(component, orderType, takerGets, takerPays)
    }
  }
}
export default install
