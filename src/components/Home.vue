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
            <span>当前成交价(XRP/CNY)：</span>
            <el-tag type="success">{{ price }}</el-tag>
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
            <el-input v-model="wssUrl" placeholder="服务器"></el-input>
          </div>
          <div class="info">
            <span>地址：</span>
            <el-input v-model="myAddress" placeholder="地址"></el-input>
          </div>
          <div class="info">
            <span>私钥：</span>
            <el-input type="password" v-model="primaryKey" placeholder="私钥"></el-input>
          </div>
          <div class="info">
            <span>网关：</span>
            <el-input v-model="gateway" placeholder="网关"></el-input>
          </div>
          
          <div class="info">
            <el-row :gutter="8">
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="买入价 = 当前价 * ( 1 - 买入比/100 )" placement="right">
                  <el-button>买入比(%)：</el-button>
                </el-tooltip>
                <el-input v-model="buyRate" placeholder="买入比(%),例如: 2"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="卖出价 = 当前价 * ( 1 + 卖出比/100 )" placement="right">
                  <el-button>卖出比(%)：</el-button>
                </el-tooltip>
                <el-input v-model="sellRate" placeholder="卖出比(%),例如: 2"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="单个订单的价值，无论买入卖出都按照CNY结算。例如买单时，订单价值 = 买入价 * 买入量" placement="right">
                  <el-button>订单价值(CNY)：</el-button>
                </el-tooltip>
                <el-input v-model="orderTotal" placeholder="订单价值(CNY),例如: 10"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="达到该上限值，则停止卖出XRP" placement="right">
                  <el-button>CNY上限：</el-button>
                </el-tooltip>
                <el-input v-model="limitCNY" placeholder="CNY上限"></el-input>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="达到该上限值，则停止买入XRP，按照CNY计算" placement="right">
                  <el-button>XRP上限(CNY)：</el-button>
                </el-tooltip>
                <el-input v-model="limitXRP" placeholder="XRP上限"></el-input>
              </el-col>
              <el-col :span="8">
                <br><br>
                <el-button type="primary" @click="save">保存配置</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="16">
          <h4>Offsers List</h4>
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
          <h4>Orders</h4>
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
  </el-row>
</template>

<script>
import Vue from 'vue'
const intervalTime = 5
const bookLimit = 20
const ledgerOffset = 100
const myInstructions = {maxLedgerVersionOffset: ledgerOffset}
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
      price: 0,
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
      buyOrderNum: 0,
      sellOrderNum: 0
    }
  },
  computed: {
    totalXRP () {
      if (this.price > 0) {
        return this.fixNum(parseFloat(this.myCNY) / parseFloat(this.price) + parseFloat(this.myXRP), 3)
      } else {
        return 0
      }
    },
    totalCNY () {
      if (this.price > 0) {
        return this.fixNum(parseFloat(this.myCNY) + parseFloat(this.myXRP) * parseFloat(this.price), 3)
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
      this.api.getOrderbook(this.myAddress, orderbook, options).then((orderbook)=>{
        // console.log(orderbook)
        let asks = orderbook.asks ? orderbook.asks.slice(0, bookLimit) : []
        let bids = orderbook.bids ? orderbook.bids.slice(0, bookLimit) : []
        this.asks = []
        this.bids = []
        asks.forEach((val, index, arr) => {
          this.asks.push({
            'amount': this.fixNum(val.specification.quantity.value, 5),
            'price': this.fixNum(val.properties.makerExchangeRate, 5),
            'atype': 'Sell',
            'account': val.properties.maker
          })
        })
        bids.forEach((val, index, arr) => {
          if (index === 0) {
            this.price = this.fixNum(1/val.properties.makerExchangeRate, 5)
          }
          this.bids.push({
            'amount': this.fixNum(val.specification.quantity.value, 5),
            'price': this.fixNum(1/val.properties.makerExchangeRate, 5),
            'atype': 'Buy',
            'account': val.properties.maker
          })
        })
      })
    },
    updateBalance () {
      this.api.getBalances(this.myAddress).then(balances =>{
        balances.forEach((val, index) => {
          if (val.currency === 'XRP') {
            this.myXRP = this.fixNum(val.value, 5)
          }
          if (val.currency === 'CNY') {
            this.myCNY = this.fixNum(val.value, 5)
          }
        })
      })
    },
    accountOffers () {
      this.api.getOrders(this.myAddress).then(offers => {
        // console.log(offers)
        this.orders = []
        this.buyOrderNum = 0
        this.sellOrderNum = 0
        if (offers.length > 0) {
          offers.forEach((val, index) => {
            this.orders.push({
              seq: val.properties.sequence,
              amount: this.fixNum(val.specification.quantity.value, 5),
              order_type: val.specification.direction,
              price: this.fixNum(val.specification.direction === 'buy' ? 1 / val.properties.makerExchangeRate : val.properties.makerExchangeRate, 5)
            })
            if (val.specification.direction === 'buy') {
              this.buyOrderNum ++
            } else {
              this.sellOrderNum ++
            }
          })
        }
      })
    },
    robot () {
      if (this.robotStatus === true) {
        // 计算买入卖出价格
        let buyPrice = this.price * (1 - this.buyRate / 100)
        let sellPrice = this.price * (1 + this.sellRate / 100)
        // 初始化数据
        let offersLength = this.orders.length
        let maxBuyOrderSeq = 0
        let maxSellOrderSeq = 0
        let tmpBuyOrders = []
        let tmpSellOrders = []
        // console.log(this.buyOrderNum === 0 && this.sellOrderNum === 0)
        if (this.buyOrderNum === 0 && this.sellOrderNum === 0) {
          this.buyOrder()
        } else {
          // 开始处理(先取消订单，再下订单)
          this.orders.forEach((val, index) => {
            if (val.order_type === 'buy') {
              // 取消超出范围的订单
              if (this.fixNum(val.price, 2) < this.fixNum(buyPrice, 2)) {
                this.api.prepareOrderCancellation(this.myAddress, {orderSequence: val.seq}, myInstructions).then(prepared => {
                  let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                  return this.api.submit(tmp.signedTransaction)
                }).then(res => {
                  console.log('Cancel Seq ' + val.seq + ',Reason: price change(' + this.fixNum(val.price, 2) + ',' + this.fixNum(buyPrice, 2) + '), Order Amount: ' + val.amount + ', Price: ' + val.price + ', Order Type:' + val.order_type, res)
                })
              } else {
                // 获取最晚的一个seq
                if (val.seq > maxBuyOrderSeq) {
                  maxBuyOrderSeq = val.seq
                }
                // 未处理订单放到临时数组
                tmpBuyOrders.push(val)
              }
            } else {
              // 取消超出范围的订单
              if (this.fixNum(val.price, 2) > this.fixNum(sellPrice, 2)) {
                this.api.prepareOrderCancellation(this.myAddress, {orderSequence: val.seq}, myInstructions).then(prepared => {
                  let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                  return this.api.submit(tmp.signedTransaction)
                }).then(res => {
                  console.log('Cancel Seq ' + val.seq + ',Reason: price change(' + this.fixNum(val.price, 2) + ',' + this.fixNum(sellPrice, 2) + ') Order Amount: ' + val.amount + ', Price: ' + val.price + ', Order Type:' + val.order_type, res)
                })
              } else {
                // 获取最晚的一个seq
                if (val.seq > maxSellOrderSeq) {
                  maxSellOrderSeq = val.seq
                }
                // 未处理订单放到临时数组
                tmpSellOrders.push(val)
              }
            }
            // 如果已经是最后一次循环
            if (index === offersLength - 1) {
              console.log('Get in last foreach:', tmpBuyOrders, tmpSellOrders, maxBuyOrderSeq, maxSellOrderSeq)
              if (tmpBuyOrders.length > 1) {
                // 处理多于一个的订单
                tmpBuyOrders.forEach((subVal, subIndex) => {
                  if (parseInt(subVal.seq) !== parseInt(maxBuyOrderSeq)) {
                    this.api.prepareOrderCancellation(this.myAddress, {orderSequence: subVal.seq}, myInstructions).then(prepared => {
                      let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                      return this.api.submit(tmp.signedTransaction)
                    }).then(res => {
                      console.log('Cancel Seq ' + subVal.seq + ',Reason: order num > 1, Order Amount: ' + subVal.amount + ', Price: ' + subVal.price + ', Order Type:' + subVal.order_type, res)
                    })
                  }
                })
              } else if (tmpBuyOrders.length === 0) {
                // 下买单
                this.buyOrder()
              }
              if (tmpSellOrders.length > 1) {
                // 处理多于一个的订单
                tmpSellOrders.forEach((subVal, subIndex) => {
                  if (subVal.seq !== maxSellOrderSeq) {
                    this.api.prepareOrderCancellation(this.myAddress, {orderSequence: subVal.seq}, myInstructions).then(prepared => {
                      let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
                      return this.api.submit(tmp.signedTransaction)
                    }).then(res => {
                      console.log('Cancel Seq ' + subVal.seq + ',Reason: order num > 1, Order Amount: ' + subVal.amount + ', Price: ' + subVal.price + ', Order Type:' + subVal.order_type, res)
                    })
                  }
                })
              } else if (tmpSellOrders.length === 0) {
                // 下卖单
                this.sellOrder()
              }
            }
          })
        }
      }
    },
    buyOrder () {
      if (parseFloat(this.myXRP) >= parseFloat(this.limitXRP / this.price)) {
        return
      }
      // 计算买入价格
      let buyPrice = this.price * (1 - this.buyRate / 100)
      console.log('Start creating buy order...')
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
      // console.log(order)
      this.api.prepareOrder(this.myAddress, order, myInstructions).then(prepared => {
        // console.log('buy:', prepared)
        let tmp = this.api.sign(prepared.txJSON, this.primaryKey)
        seq = prepared.instructions.sequence
        // console.log('buy:', tmp)
        return this.api.submit(tmp.signedTransaction)
      }).then(res => {
        if (this.sellOrderNum === 0) {
          this.sellOrder()
        }
        this.orders.push({
          seq: seq,
          amount: xrpVal,
          order_type: 'buy',
          price: this.fixNum(buyPrice, 5)
        })
        console.log('Create Buy Order, Buy ' + xrpVal + ' XRP, Price: ' + buyPrice, res)
      })
    },
    sellOrder () {
      if (parseFloat(this.myCNY) >= parseFloat(this.limitCNY)) {
        return
      }
      // 计算卖出价格
      let sellPrice = this.price * (1 + this.sellRate / 100)
      console.log('Start creating sell order...')
      let xrpVal = this.fixNum(parseFloat(this.orderTotal) / (parseFloat(sellPrice)), 5).toString()
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
        console.log('Create Sell Order, Sell ' + xrpVal + ' XRP, Price: ' + sellPrice, res)
      })
    },
    intervalFunc () {
      if (this.connectStatus === true) {
        console.log('run')
        this.updateBalance()
        this.orderbook()
        this.accountOffers()
        this.robot()
      }
    },
    tableRowClassName (row, index) {
      if (row.account === this.myAddress) {
        return 'info-buy'
      }
    }
  },
  mounted () {
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
      this.interval = setInterval(() => {
        this.intervalFunc()
      }, intervalTime * 1000)
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
</style>
