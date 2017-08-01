<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <!-- status -->
      <el-row>
        <el-col :span="6">
          <span>服务器链接状态：</span>
          <template v-if="connectStatus">
            <el-tag type="success">{{ connectStatusText }}</el-tag>
          </template>
          <template v-else>
            <el-tag type="danger">{{ connectStatusText }}</el-tag>
          </template>
        </el-col>
        <el-col :span="6">
          <span>机器人状态：</span>
          <el-switch
            v-model="robotStatus"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-col>
      </el-row>
      <!-- content -->
      <el-row :gutter="12">
        <el-col :span="8">
          <div class="info">
            <span>Buy Price：</span>
            <el-tag type="success">{{ buyPrice }}</el-tag>
            <span>Sell Price：</span>
            <el-tag type="success">{{ sellPrice }}</el-tag>
          </div>
          <div class="info">
            <el-row>
              <el-col :span="12">
                <el-tooltip class="item" effect="dark" content="当前可用CNY" placement="right">
                  <el-button>当前拥有CNY：{{ myCNY }}</el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="12">
                <el-tooltip class="item" effect="dark" content="当前可用XRP" placement="right">
                  <el-button>当前拥有XRP：{{ myXRP }}</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <div class="info">
            <el-row>
              <el-col :span="12">
                <el-tooltip class="item" effect="dark" content="当前可用CNY + 当前可用XRP * 当前价" placement="right">
                  <el-button>CNY资产：{{ totalCNY }}</el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="12">
                <el-tooltip class="item" effect="dark" content="当前可用CNY / 当前价 + 当前可用XRP" placement="right">
                  <el-button>XRP资产：{{ totalXRP }}</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <div class="info">
            <span>服务器：</span>
            <el-input v-model.trim="wssUrl" placeholder="服务器"></el-input>
          </div>
          <div class="info">
            <span>地址：</span>
            <el-input v-model.trim="myAddress" placeholder="地址"></el-input>
          </div>
          <div class="info">
            <span>私钥：</span>
            <el-input type="password" v-model.trim="primaryKey" placeholder="私钥"></el-input>
          </div>
          <div class="info">
            <span>网关：</span>
            <el-input v-model.trim="gateway" placeholder="网关"></el-input>
          </div>
          
          <div class="info">
            <el-row :gutter="8">
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="买入价 = buyPrice * ( 1 - 买入比/100 )" placement="right">
                  <el-button>买入比(%)：</el-button>
                </el-tooltip>
                <el-input v-model.trim="buyRate" placeholder="买入比(%),例如: 2"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="卖出价 = sellPrice * ( 1 + 卖出比/100 )" placement="right">
                  <el-button>卖出比(%)：</el-button>
                </el-tooltip>
                <el-input v-model.trim="sellRate" placeholder="卖出比(%),例如: 2"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="单个订单的价值，无论买入卖出都按照CNY结算。例如买单时，订单价值 = 买入价 * 买入量" placement="right">
                  <el-button>订单价值(CNY)：</el-button>
                </el-tooltip>
                <el-input v-model.trim="orderTotal" placeholder="订单价值(CNY),例如: 10"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="CNY达到该上限值，则停止卖出XRP" placement="right">
                  <el-button>CNY上限：</el-button>
                </el-tooltip>
                <el-input v-model.trim="limitCNY" placeholder="CNY上限"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="XRP达到该上限值，则停止买入XRP（按照CNY计算，即实际的XRP上限值为 你设置的XRP上限值/sellPrice ）" placement="right">
                  <el-button>XRP上限(CNY)：</el-button>
                </el-tooltip>
                <el-input v-model.trim="limitXRP" placeholder="XRP上限"></el-input>
              </el-col>
              <el-col :span="8">
                <br><br>
                <el-button type="primary" @click="save">保存配置</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="16">
          <h4>Orderbook</h4>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-table
                :data="bids"
                height="250"
                border
                style="width: 100%"
                :row-class-name="tableRowClassName">
                <el-table-column label="买单" align="right">
                  <el-table-column
                    prop="atype"
                    label="类型"
                    align="right">
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    label="数量(XRP)"
                    align="right">
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    label="价格(CNY)"
                    align="right">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <el-table
                :data="asks"
                height="250"
                border
                style="width: 100%"
                :row-class-name="tableRowClassName">
                <el-table-column label="卖单" align="left">
                  <el-table-column
                    prop="price"
                    label="价格(CNY)">
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    label="数量(XRP)">
                  </el-table-column>
                  <el-table-column
                    prop="atype"
                    label="类型">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <h4>My Orders</h4>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-table
                :data="orders"
                border
                style="width: 100%">
                <el-table-column
                  prop="seq"
                  label="Seq">
                </el-table-column>
                <el-table-column
                  prop="order_type"
                  label="Type">
                </el-table-column>
                <el-table-column
                  prop="amount"
                  label="数量(XRP)">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="价格">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
    <el-col id="donor" :span="20" :offset="2">
      捐助作者XRP： <b>{{ donor }}</b>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue'
const version = 'v0.0.6'
const intervalTime = 5
const checkOrderIntervalTime = 1
const bookLimit = 20
const ledgerOffset = 500
const myInstructions = {maxLedgerVersionOffset: ledgerOffset}
const sensitivity = 1
export default {
  name: 'home',
  data () {
    return {
      api: null,
      wssUrl: 'wss://s1.ripple.com',
      interval: null,
      ws: null,
      connectStatus: false,
      connectStatusText: '未连接',
      robotStatus: false,
      buyPrice: 0,
      sellPrice: 0,
      myXRP: 0,
      myCNY: 0,
      myAddress: null,
      primaryKey: null,
      gateway: null,
      buyRate: null,
      sellRate: null,
      orderTotal: null, // 订单量
      limitCNY: null,
      limitXRP: null,
      asks: [],
      bids: [],
      transactions: [],
      sequence: 0,
      ledgerSequence: 0,
      orders: [],
      buyOrders: [],
      sellOrders: [],
      donor: 'r4ff6mjZ1Huznci4ZQXZZ6V7ZU7yt9S6ha'
    }
  },
  computed: {
    totalXRP () {
      if (this.sellPrice > 0) {
        return this.fixNum(parseFloat(this.myXRP) + parseFloat(this.myCNY) / parseFloat(this.sellPrice), 3)
      } else {
        return 0
      }
    },
    totalCNY () {
      if (this.buyPrice > 0) {
        return this.fixNum(parseFloat(this.myCNY) + parseFloat(this.myXRP) * parseFloat(this.buyPrice), 3)
      } else {
        return 0
      }
    }
  },
  methods: {
    save (e) {
      let mem = {
        myAddress: this.myAddress,
        primaryKey: this.primaryKey,
        gateway: this.gateway,
        buyRate: this.buyRate,
        sellRate: this.sellRate,
        orderTotal: this.orderTotal,
        limitCNY: this.limitCNY,
        limitXRP: this.limitXRP
      }
      localStorage.mem = JSON.stringify(mem)
      this.msgOpen('保存成功', 'success')
    },
    msgOpen (msg, msgType = 'success') {
      switch (msgType) {
        case 'error':
          this.$message.error(msg)
          console.error(msg)
          break
        case 'success':
        case 'warning':
          this.$message({
            message: msg,
            type: msgType
          })
          console.log(msg)
          break
        default:
          this.$message(msg)
          console.log(msg)
          break
      }
    },
    fixNum (val, limit = 3) {
      val = parseFloat(val)
      return val.toFixed(limit)
    },
    orderbook (data) {
      const orderbook = {
        'base': {
          'currency': 'XRP'
        },
        "counter": {
          'currency': 'CNY',
          'counterparty': this.gateway
        }
      }
      const options = {
        limit: 30
      }
      return new Promise((resolve, reject) => {
        this.api.getOrderbook(this.myAddress, orderbook, options).then((orderbookRes)=>{
          this.console(orderbookRes)
          let asks = orderbookRes.asks ? orderbookRes.asks.slice(0, bookLimit) : [] // 卖单
          let bids = orderbookRes.bids ? orderbookRes.bids.slice(0, bookLimit) : [] // 买单
          this.asks = []
          this.bids = []

          return Promise.all(asks.map((row, index) => {
            return new Promise((resolve1, reject1) => {
              if (index === 0) {
                this.sellPrice = this.fixNum(row.properties.makerExchangeRate, 5)
              }
              this.asks.push({
                'amount': this.fixNum(row.specification.quantity.value, 5),
                'price': this.fixNum(row.properties.makerExchangeRate, 5),
                'atype': 'Sell',
                'account': row.properties.maker
              })
              resolve1('asks:'+index)
            });
          })).then((asksResult) => {
            this.console(['asks result update', asksResult])
            return Promise.all(bids.map((row, index) => {
              return new Promise((resolve1, reject1) => {
                if (index === 0) {
                  this.buyPrice = this.fixNum(1/row.properties.makerExchangeRate, 5)
                }
                this.bids.push({
                  'amount': this.fixNum(row.specification.quantity.value, 5),
                  'price': this.fixNum(1/row.properties.makerExchangeRate, 5),
                  'atype': 'Buy',
                  'account': row.properties.maker
                })
                resolve1('bids:'+index)
              })
            }))
          }).then((bidsResult) => {
            this.console(['bids result update', bidsResult])
            resolve(bidsResult)
          }).catch((err) => {
            console.error(err, 'orderbook')
          })
        })
      })
    },
    updateBalance () {
      return new Promise((resove, reject) => {
        this.api.getBalances(this.myAddress).then(balances =>{
          return Promise.all(balances.map((row, i) => {
            return new Promise((resove1, reject1) => {
              if (row.currency === 'XRP') {
                this.myXRP = this.fixNum(row.value, 5)
              }
              if (row.currency === 'CNY') {
                this.myCNY = this.fixNum(row.value, 5)
              }
              resove1('true' + i)
            })
          }))
        }).then((result) => {
          resove(result)
        }).catch((err) => {
          console.error(err)
        })
      })
    },
    accountOffers () {
      return new Promise((resolve, reject) => {
        this.api.getOrders(this.myAddress).then(offers => {
          this.console(['current_account_offers', offers])
          this.orders = []
          this.buyOrders = []
          this.sellOrders = []
          if (offers.length > 0) {
            return Promise.all(offers.map((row, index) => {
              return new Promise((resolve1, reject1) => {
                let order = {
                  seq: row.properties.sequence,
                  amount: this.fixNum(row.specification.quantity.value, 5),
                  order_type: row.specification.direction,
                  price: this.fixNum(row.specification.direction === 'buy' ? 1 / row.properties.makerExchangeRate : row.properties.makerExchangeRate, 5)
                }
                this.orders.push(order)
                if (row.specification.direction === 'buy') {
                  this.buyOrders.push(order)
                } else {
                  this.sellOrders.push(order)
                }
                resolve1('account_offers'+index)
              })
            })).then((res) => {
              resolve(res)
            }).catch((err) => {
              console.error(err)
            })
          } else {
            resolve(0)
          }
        })
      })
    },
    buyRobot () {
      this.console('buy_robot')
      return new Promise((resolve, reject) => {
        this.console(['robotStatus', this.robotStatus])
        if (this.robotStatus === true) {
          // 计算买入卖出价格
          let buyPrice = this.buyPrice * (1 - this.buyRate / 100)
          // 初始化数据
          let maxBuyOrderSeq = 0
          let tmpBuyOrders = []
          // 开始处理(先取消订单，再下订单)
          return Promise.all(this.buyOrders.map((val, index) => {
            return new Promise((resolve1, reject1) => {
              // 取消超出范围的买单
              if (this.fixNum(val.price, sensitivity) < this.fixNum(buyPrice, sensitivity)) {
                this.api.prepareOrderCancellation(this.myAddress, {orderSequence: val.seq}, myInstructions).then(prepared => {
                  let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                  return this.api.submit(tmp.signedTransaction)
                }).then(res => {
                  this.console(['Cancel Seq ' + val.seq + ',Reason: price change(' + this.fixNum(val.price, sensitivity) + ',' + this.fixNum(buyPrice, sensitivity) + '), Order Amount: ' + val.amount + ', Price: ' + val.price + ', Order Type:' + val.order_type, res], 'msg')
                  resolve1('cancel_buy_order:'+val.seq)
                })
              } else {
                // 获取最晚的一个seq
                if (val.seq > maxBuyOrderSeq) {
                  maxBuyOrderSeq = val.seq
                }
                // 未处理订单放到临时数组
                tmpBuyOrders.push(val)
                resolve1(0)
              }
            })
          })).then((buyOrdersRes) => {
            this.console(['buy_orders_res', buyOrdersRes])
            if (tmpBuyOrders.length > 1) {
              this.console('tmp_buy_order_length > 1')
              // 处理多于一个的订单
              Promise.all(tmpBuyOrders.map((subVal, subIndex) => {
                return new Promise((resolve1, reject1) => {
                  if (parseInt(subVal.seq) !== parseInt(maxBuyOrderSeq)) {
                    this.api.prepareOrderCancellation(this.myAddress, {orderSequence: subVal.seq}, myInstructions).then(prepared => {
                      let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                      return this.api.submit(tmp.signedTransaction)
                    }).then(res => {
                      this.console(['Cancel Seq ' + subVal.seq + ',Reason: order num > 1, Order Amount: ' + subVal.amount + ', Price: ' + subVal.price + ', Order Type:' + subVal.order_type, res], 'msg')
                      resolve1('cancel_buy_order1:'+subVal.seq)
                    })
                  }
                })
              })).then((tmpBuyOrdersRes) => {
                this.console(['tmp_buy_orders_res', tmpBuyOrdersRes])
                resolve()
              })
            } else if (tmpBuyOrders.length === 0) {
              // 下买单
              let buyOrderRes = this.buyOrder()
              this.console(['tmp_buy_order_length == 0', buyOrderRes])
              resolve(buyOrderRes)
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    sellRobot () {
      this.console('sell_robot')
      return new Promise((resolve, reject) => {
        this.console(['robotStatus', this.robotStatus])
        if (this.robotStatus === true) {
          // 计算买入卖出价格
          let sellPrice = this.sellPrice * (1 + this.sellRate / 100)
          // 初始化数据
          let maxSellOrderSeq = 0
          let tmpSellOrders = []
          // 开始处理(先取消订单，再下订单)
          return Promise.all(this.sellOrders.map((val, index) => {
            return new Promise((resolve1, reject1) => {
              // 取消超出范围的卖单
              if (this.fixNum(val.price, sensitivity) > this.fixNum(sellPrice, sensitivity)) {
                this.api.prepareOrderCancellation(this.myAddress, {orderSequence: val.seq}, myInstructions).then(prepared => {
                  let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                  return this.api.submit(tmp.signedTransaction)
                }).then(res => {
                  this.console(['Cancel Seq ' + val.seq + ',Reason: price change(' + this.fixNum(val.price, sensitivity) + ',' + this.fixNum(sellPrice, sensitivity) + ') Order Amount: ' + val.amount + ', Price: ' + val.price + ', Order Type:' + val.order_type, res], 'msg')
                  resolve1('cancel_sell_order:'+val.seq)
                })
              } else {
                // 获取最晚的一个seq
                if (val.seq > maxSellOrderSeq) {
                  maxSellOrderSeq = val.seq
                }
                // 未处理订单放到临时数组
                tmpSellOrders.push(val)
                resolve1(0)
              }
            })
          })).then((sellOrdersRes) => {
            this.console(['sell_orders_res', sellOrdersRes])
            if (tmpSellOrders.length > 1) {
              // 处理多于一个的订单
              Promise.all(tmpSellOrders.map((subVal, subIndex) => {
                return new Promise((resolve1, reject1) => {
                  if (parseInt(subVal.seq) !== parseInt(maxSellOrderSeq)) {
                    this.api.prepareOrderCancellation(this.myAddress, {orderSequence: subVal.seq}, myInstructions).then(prepared => {
                      let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                      return this.api.submit(tmp.signedTransaction)
                    }).then(res => {
                      this.console(['Cancel Seq ' + subVal.seq + ',Reason: order num > 1, Order Amount: ' + subVal.amount + ', Price: ' + subVal.price + ', Order Type:' + subVal.order_type, res], 'msg')
                      resolve1('cancel_sell_order1:'+subVal.seq)
                    })
                  }
                })
              })).then((tmpSellOrdersRes) => {
                this.console(['tmp_sell_orders_res', tmpSellOrdersRes])
                resolve()
              })
            } else if (tmpSellOrders.length === 0) {
              // 下卖单
              let sellOrderRes = this.sellOrder()
              resolve(sellOrderRes)
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    buyOrder () {
      // 如果拥有的xrp大于限定值，则不买进
      if (parseFloat(this.myXRP) >= parseFloat(this.limitXRP / this.sellPrice)) {
        this.console(['myXRP > limitXRP / sellPrice', parseFloat(this.myXRP), parseFloat(this.limitXRP / this.sellPrice)])
        return
      }
      // 如果买入量大于当前拥有值，则不买进
      if (parseFloat(this.orderTotal) > parseFloat(this.myCNY)) {
        this.console(['orderTotal > myCNY', parseFloat(this.orderTotal), parseFloat(this.myCNY)])
        return
      }
      // 计算买入价格
      let buyPrice = this.buyPrice * (1 - this.buyRate / 100)
      this.console('Start creating buy order...', 'msg')
      let xrpVal = this.fixNum(parseFloat(this.orderTotal) / (parseFloat(buyPrice)), 5).toString()
      const order = {
        'direction': 'buy',
        'quantity': {
          'currency': 'XRP',
          'value': xrpVal
        },
        'totalPrice': {
          'currency': 'CNY',
          'counterparty': this.gateway,
          'value': this.orderTotal
        }
      }
      let seq = null
      this.console(order)
      return new Promise((resolve, reject) => {
        this.api.prepareOrder(this.myAddress, order, myInstructions).then(prepared => {
          this.console(['buy_prepared:', prepared])
          let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
          seq = prepared.instructions.sequence
          this.console(['buy_signed:', tmp])
          return this.api.submit(tmp.signedTransaction)
        }).then(res => {
          this.orders.push({
            seq: seq,
            amount: xrpVal,
            order_type: 'buy',
            price: this.fixNum(buyPrice, 5)
          })
          this.console(['Create Buy Order, Buy ' + xrpVal + ' XRP, Price: ' + buyPrice, res], 'msg')
          return true
        }).then(() => {
          return true
        })
      })
    },
    sellOrder () {
      // 计算卖出价格
      let sellPrice = this.sellPrice * (1 + this.sellRate / 100)
      let xrpVal = this.fixNum(parseFloat(this.orderTotal) / (parseFloat(sellPrice)), 5).toString()
      // 如果拥有的cny大于限定值，则不卖出
      if (parseFloat(this.myCNY) >= parseFloat(this.limitCNY)) {
        this.console(['myCNY > limitCNY', parseFloat(this.myCNY), parseFloat(this.limitCNY)])
        return
      }
      // 如果订单价值大于当前拥有的xrp，则停止操作
      if (parseFloat(xrpVal) > parseFloat(this.myXRP)) {
        this.console(['xrpVal > myXRP', parseFloat(xrpVal), parseFloat(this.myXRP)])
        return
      }
      this.console('Start creating sell order...', 'msg')
      const order = {
        'direction': 'sell',
        'quantity': {
          'currency': 'XRP',
          'value': xrpVal
        },
        'totalPrice': {
          'currency': 'CNY',
          'counterparty': this.gateway,
          'value': this.orderTotal
        }
      }
      let seq = null
      // console.log(order)
      return new Promise((resolve, reject) => {
        this.api.prepareOrder(this.myAddress, order, myInstructions).then(prepared => {
          // console.log('sell:', prepared)
          let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
          // console.log('sell:', tmp)
          seq = prepared.instructions.sequence
          return this.api.submit(tmp.signedTransaction)
        }).then(res => {
          this.orders.push({
            seq: seq,
            amount: xrpVal,
            order_type: 'sell',
            price: this.fixNum(sellPrice, 5)
          })
          this.console(['Create Sell Order, Sell ' + xrpVal + ' XRP, Price: ' + sellPrice, res], 'msg')
          return
        })
      })
    },
    intervalFunc () {
      if (this.connectStatus === true) {
        this.updateBalance().then((balancesRes) => {
          this.console(['get balances', balancesRes])
          return this.orderbook()
        }).then((orderbookRes) => {
          this.console(['update orderbook', orderbookRes])
          return this.accountOffers()
        }).then((offersRes) => {
          this.console(['update offers', offersRes])
          return this.buyRobot()
        }).then((buyRobotRes) => {
          this.console(['buy_robot_finish', buyRobotRes])
          return this.sellRobot()
        }).then((sellRobotRes) => {
          this.console(['sell_robot_finish', sellRobotRes])
        }).catch(err => {
          console.error(err)
        })
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.intervalFunc()
          }, intervalTime * 1000)
        }).then().catch((err) => {
          console.error(err)
        })
      }
    },
    tableRowClassName (row, index) {
      if (row.account === this.myAddress) {
        return 'info-buy'
      }
    },
    console (txt, dataType='debug') {
      if (dataType === 'msg' || (debugRippleBot === true && dataType === 'debug')) {
        console.log(txt)
      }
    }
  },
  mounted () {
    console.log(version)
    // load config if exist
    if (localStorage.mem !== undefined) {
      let localMem = JSON.parse(localStorage.mem)
      this.myAddress = localMem.myAddress
      this.primaryKey = localMem.primaryKey
      this.gateway = localMem.gateway
      this.buyRate = localMem.buyRate
      this.sellRate = localMem.sellRate
      this.orderTotal = localMem.orderTotal
      this.limitCNY = localMem.limitCNY
      this.limitXRP = localMem.limitXRP
    }
    // connect ws
    this.api = new window.ripple.RippleAPI({
      server: this.wssUrl // Public rippled server
    })
    this.msgOpen('正在连接服务器...', 'success')
    
    this.api.on('connected', () => {
      this.connectStatus = true
      this.connectStatusText = '已连接'
      this.intervalFunc()
      this.msgOpen('服务器已连接', 'success')
    })
    this.api.on('disconnected', (code) => {
      this.connectStatus = false
      this.connectStatusText = '未连接'
      this.api.connect()
      this.msgOpen('服务器断开连接', 'warning')
    })
    this.api.connect()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-row {
    margin-top: 10px;
  }
  .info {
    margin-top: 10px;
  }
  .transactions {
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .el-table .info-buy {
    background-color: #e2f0e4;
  }
  .el-table .info-sell {
    background-color: #f2dede;
  }
  #donor {
    background-color: #eef1f6;
    text-align: center;
    padding: 10px 0;
    margin-top: 10px;
  }
</style>
