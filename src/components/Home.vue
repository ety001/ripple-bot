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
      <el-row>
        <el-col :span="12">
          
        </el-col>
        <el-col :span="12">
          <div class="info">
            <span>当前成交价(CNY/XRP)：</span>
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
            <el-input v-model="primaryKey" placeholder="私钥"></el-input>
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
                <el-button type="primary" @click="save">保存到本地缓存</el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
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
      orderTotal: null,
      limitCNY: null,
      limitXRP: null
    }
  },
  computed: {
    totalXRP () {
      return 0
    },
    totalCNY () {
      return 0
    }
  },
  methods: {
    save (e) {

    }
  },
  mounted () {
    this.ws = new WebSocket('wss://s1.ripple.com')
    let that = this
    this.ws.onopen = () => {
      that.connectStatus = true
      that.connectStatusText = '已连接'
      console.log('websocket is on open!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-row {
    margin-top: 10px;
  }
  .info {
    margin-top: 10px;
  }
</style>
