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
                stripe
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
import Ripple from '@/Lib/Ripple'
import Robot from '@/Lib/Robot'

Vue.use(Ripple)
Vue.use(Robot)

const drops = 1000000
const intervalTime = 5
const bookLimit = 30

export default {
  name: 'home',
  data () {
    return {
      interval: null,
      ws: null,
      connectting: false,
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
      orders: []
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
    onMsg (e) {
      let data = JSON.parse(e.data)
      console.log('ws:', data)
      if (data.type === 'response') {
        switch (data.id) {
          case 'ping_pong':
            Vue.Ripple.pong(this, data)
            break
          case 'xrp_cny_order_book':
            this.orderbook(data)
            break
          case 'tx_status':
            this.txAdd(data)
            break
          case 'update_balance':
            this.updateBalance(data)
            break
          case 'account_line':
            this.updateGatewayBalance(data)
            break
          case 'buy_book':
            this.buyBooks(data)
            break
          case 'sell_book':
            this.sellBooks(data)
            break
          case 'order_create_buy':
            this.orderCreate('buy', data)
            break
          case 'order_create_sell':
            this.orderCreate('sell', data)
            break
          case 'order_cancel':
            this.orderCancel(data)
            break
          case 'account_offer':
            this.accountOffer(data)
            break
          default:
            break
        }
      } else if (data.type === 'transaction') {
        this.transaction(data)
      }
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
      return val.toFixed(limit)
    },
    orderbook (data) {
      let asks = data.result ? data.result.asks.slice(0, 15) : []
      let bids = data.result ? data.result.bids.slice(0, 15) : []
      let that = this
      asks.forEach((val, index, arr) => {
        that.asks.push({
          'amount': that.fixNum(val.TakerGets / drops, 3),
          'price': that.fixNum(val.TakerPays.value / (val.TakerGets / drops), 3),
          'atype': 'Sell'
        })
      })
      bids.forEach((val, index, arr) => {
        that.bids.push({
          'amount': that.fixNum(val.TakerPays / drops, 3),
          'price': that.fixNum(val.TakerGets.value / (val.TakerPays / drops), 3),
          'atype': 'Buy'
        })
      })
    },
    buyBooks (data) {
      let asks = data.result ? data.result.offers : []
      let that = this
      that.asks = []
      asks.forEach((val, index, arr) => {
        that.asks.push({
          'amount': that.fixNum(val.TakerGets / drops, 3),
          'price': that.fixNum(val.TakerPays.value / (val.TakerGets / drops), 3),
          'atype': 'Sell',
          'account': val.Account
        })
      })
    },
    sellBooks (data) {
      let bids = data.result ? data.result.offers : []
      let that = this
      this.price = that.fixNum(bids[0].TakerGets.value / (bids[0].TakerPays / drops), 3)
      that.bids = []
      bids.forEach((val, index, arr) => {
        that.bids.push({
          'amount': that.fixNum(val.TakerPays / drops, 3),
          'price': that.fixNum(val.TakerGets.value / (val.TakerPays / drops), 3),
          'atype': 'Buy',
          'account': val.Account
        })
      })
    },
    transaction (data) {
      let detail = data.transaction
      if (data.engine_result === 'tesSUCCESS' && detail.TransactionType === 'OfferCreate') {
        Vue.Ripple.txStatus(this, detail.hash)
      }
    },
    txAdd (data) {
      if (data.result.validated === true) {
        let result = data.result
        if (typeof result.TakerPays === 'object' && typeof result.TakerGets === 'object') {
          return
        }
        this.transactions.unshift({
          'amount': this.fixNum(typeof result.TakerPays === 'string' ? result.TakerPays / drops : result.TakerGets / drops, 3),
          'price': this.fixNum(typeof result.TakerPays === 'string' ? result.TakerGets.value / (result.TakerPays / drops) : result.TakerPays.value / (result.TakerGets / drops), 3),
          'atype': typeof result.TakerPays === 'string' ? 'Sell' : 'Buy',
          'tx': result.hash
        })
      }
    },
    transactionsRowClassName (row, index) {
      if (row.atype === 'Sell') {
        return 'info-sell'
      }
      if (row.atype === 'Buy') {
        return 'info-buy'
      }
    },
    updateBalance (data) {
      if (data.status === 'success') {
        this.myXRP = this.fixNum(data.result.account_data.Balance / drops, 5)
        this.sequence = parseInt(data.result.account_data.Sequence)
      }
    },
    updateGatewayBalance (data) {
      if (data.status === 'success') {
        this.myCNY = data.result.lines[0].balance
        this.ledgerSequence = parseInt(data.result.ledger_current_index + 20)
      }
    },
    intervalFunc () {
      if (this.connectStatus === true) {
        console.log('run')
        Vue.Ripple.updateBalance(this, this.myAddress)
        Vue.Ripple.updateAccountLine(this, this.myAddress)
        Vue.Ripple.getBooks(this, 'buy', bookLimit)
        Vue.Ripple.getBooks(this, 'sell', bookLimit)
        Vue.Ripple.getAccountOffers(this)
        Vue.Robot.run(this, Vue.Ripple)
      }
    },
    orderCreate (orderType, data) {
      console.log('orderCreate')
      console.log(orderType, data)
    },
    orderCancel (data) {
      console.log('orderCancel')
      console.log(data)
    },
    accountOffer (data) {
      if (data.result) {
        let that = this
        let offers = data.result.offers
        this.orders = []
        offers.forEach((val, index) => {
          let tmp = {
            seq: 0,
            amount: 0,
            order_type: null,
            price: 0
          }
          if (typeof val.taker_gets === 'string' && typeof val.taker_pays === 'object') {
            tmp.order_type = 'sell'
            tmp.price = this.fixNum(parseFloat(val.taker_pays.value) / (parseFloat(val.taker_gets) / drops), 3)
            tmp.amount = this.fixNum(parseFloat(val.taker_gets) / drops, 3)
          } else if (typeof val.taker_gets === 'object' && typeof val.taker_pays === 'string') {
            tmp.order_type = 'buy'
            tmp.price = this.fixNum(parseFloat(val.taker_gets.value) / (parseFloat(val.taker_pays) / drops), 3)
            tmp.amount = this.fixNum(parseFloat(val.taker_pays) / drops, 3)
          }
          tmp.seq = val.seq
          that.orders.push(tmp)
        })
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
    this.msgOpen('正在连接服务器...', 'success')
    this.ws = new WebSocket('wss://s1.ripple.com')
    let that = this
    this.ws.onopen = () => {
      that.connectting = false
      that.connectStatus = true
      that.connectStatusText = '已连接'
      that.intervalFunc()
      that.interval = setInterval(() => {
        // Vue.Ripple.ping(that.ws)
        if (that.connectStatus === true) {
          that.intervalFunc()
        }
      }, intervalTime * 1000)
      that.msgOpen('服务器已连接', 'success')
      // Vue.Ripple.subscribeBooks(that)
    }
    this.ws.onclose = () => {
      that.connectStatus = false
      that.connectStatusText = '未连接'
      // clearInterval(that.interval)
      console.log('websocket is closed! Reconnecting...')
      // reconnect
      let tmpInterval = setInterval(() => {
        if (that.connectStatus === false && that.connectting === false) {
          that.ws = new WebSocket('wss://s1.ripple.com')
          that.connectting = true
        }
        if (that.connectStatus === true) {
          clearInterval(tmpInterval)
        }
      }, 5000)
    }
    this.ws.onmessage = this.onMsg
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
