import axios from 'axios'
import { createHmac } from 'node:crypto'

// TODO How to use.
// import { BitkubApi } from "./bitkub-api"
// const bitkubApi = new BitkubApi()
// const res = async () => console.log(await bitkubApi.ticker("THB_XLM"))
// const res = async () => console.log(await bitkubApi.placeBid("THB_XLM", 1000000, 10, "limit"))
// res()

type reqType = 'GET' | 'POST'

class APIError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export class BitkubApi {
  constructor(key?: string, secret?: string) {
    this.key = key ?? process.env.API_KEY_KUB ?? 'nokey'
    this.secret = secret ?? process.env.API_SECRET_KUB ?? 'nokey'
  }

  key: string
  secret: string
  BITKUB_ROOT_URL = process.env.BITKUB_ROOT_URL ?? 'https://api.bitkub.com'

  private async apiSecureSender(req: reqType, params: any, urlapi: string) {
    try {
      if (this.key == 'nokey' || this.secret == 'nokey') throw 'key not found'

      const timeStamp = Date.now().toString()
      const sig = createHmac('sha256', this.secret).update(JSON.stringify(timeStamp + req + urlapi + params ? params.toString() : '')).digest('hex')
      if (req == 'GET') {
        const { data } = await axios({
          method: req,
          url: this.BITKUB_ROOT_URL + urlapi,
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'X-BTK-APIKEY': this.key,
            'X-BTK-TIMESTAMP': timeStamp,
            'X-BTK-SIGN': sig,
          },
          params: params,
        })
        if (data?.error && data.error != 0) return new APIError(this.geterrorDescription(data.error), data.error)
        return data
      } else {
        const { data } = await axios({
          method: req,
          url: this.BITKUB_ROOT_URL + urlapi,
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'X-BTK-APIKEY': this.key,
            'X-BTK-TIMESTAMP': timeStamp,
            'X-BTK-SIGN': sig,
          },
          data: params,
        })
        if (data?.error && data.error != 0) return new APIError(this.geterrorDescription(data.error), data.error)
        return data
      }
    } catch (error) {
      return error
    }
  }

  private async apiSender(req: reqType, params: any, urlapi: string) {
    try {
      // const { data, status, statusText, headers, config, request }
      const { data } = await axios({
        method: req,
        url: this.BITKUB_ROOT_URL + urlapi,
        params: params,
      })
      if (data?.error && data.error != 0) return new APIError(this.geterrorDescription(data.error), data.error)
      return data
    } catch (error) {
      return error
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Get endpoint status. When status is not ok, it is highly recommended to wait until the status changes back to ok.
   * @returns `[
  {
    "name": "Non-secure endpoints",
    "status": "ok",
    "message": ""
  },
  {
    "name": "Secure endpoints",
    "status": "ok",
    "message": ""
  }
]`
   */
  async status() {
    const params = {}
    return await this.apiSender('GET', params, '/api/status')
  }

  /**
   * Get server timestamp
   * @returns `1707220534359`
   */
  async servertime() {
    const params = {}
    return await this.apiSender('GET', params, '/api/v3/servertime')
  }

  /**
   * List all available symbols.
   * @returns `{
  "error": 0,
  "result": [
    {
      "id": 1,
      "symbol": "THB_BTC",
      "info": "Thai Baht to Bitcoin"
    },
    {
      "id": 2,
      "symbol": "THB_ETH",
      "info": "Thai Baht to Ethereum"
    }
  ]
}` 
   */
  async symbols() {
    const params = {}
    return await this.apiSender('GET', params, '/api//market/symbols')
  }

  /**
   * Get ticker information.
   * @param symbol string The symbol (optional) e.g. thb_btc
   * @returns `{
  "THB_BTC": {
    "id": 1,
    "last": 216415.00,
    "lowestAsk": 216678.00,
    "highestBid": 215000.00,
    "percentChange": 1.91,
    "baseVolume": 71.02603946,
    "quoteVolume": 15302897.99,
    "isFrozen": 0,
    "high24hr": 221396.00,
    "low24hr": 206414.00
  },
  "THB_ETH": {
    "id": 2,
    "last": 11878.00,
    "lowestAsk": 12077.00,
    "highestBid": 11893.00,
    "percentChange": -0.49,
    "baseVolume": 455.17839270,
    "quoteVolume": 5505664.42,
    "isFrozen": 0,
    "high24hr": 12396.00,
    "low24hr": 11645.00
  }
}`
   */
  async ticker(symbol?: string) {
    const params = {
      sym: symbol
    }
    return await this.apiSender('GET', params, '/api/market/ticker')
  }

  /**
   * List recent trades.
   * @param symbol string The symbol (e.g. thb_btc)
   * @param limit int No. of limit to query recent trades
   * @returns `{
  "error": 0,
  "result": [
    [
      1529516287, // timestamp
      10000.00, // rate
      0.09975000, // amount
      "BUY" // side
    ]
  ]
}` 
   */
  async trades(symbol: string, limit: number) {
    const params = {
      sym: symbol,
      lmt: limit
    }
    return await this.apiSender('GET', params, '/api/market/trades')
  }

  /**
   * List open buy orders.
   * @param symbol string The symbol (e.g. thb_btc)
   * @param limit int No. of limit to query open buy orders
   * @returns `{
  "error": 0,
  "result": [
    [
      "1", // order id
      1529453033, // timestamp
      997.50, // volume
      10000.00, // rate
      0.09975000 // amount
    ]
  ]
}
`
   */
  async bids(symbol: string, limit: number) {
    const params = {
      sym: symbol,
      lmt: limit
    }
    return await this.apiSender('GET', params, '/api/market/bids')
  }

  /**
   * List open sell orders.
   * @param symbol  string The symbol (e.g. thb_btc)
   * @param limit  int No. of limit to query open sell orders
   * @returns `{
  "error": 0,
  "result": [
    [
      "680", // order id
      1529491094, // timestamp
      997.50, // volume
      10000.00, // rate
      0.09975000 // amount
    ]
  ]
}`
   */
  async asks(symbol: string, limit: number) {
    const params = {
      sym: symbol,
      lmt: limit
    }
    return await this.apiSender('GET', params, '/api/market/asks')
  }

  /**
   * List all open orders.
   * @param symbol string The symbol (e.g. thb_btc)
   * @param limit int No. of limit to query open orders
   * @returns `{
  "error": 0,
  "result": {
    "bids": [
      [
        "1", // order id
        1529453033, // timestamp
        997.50, // volume
        10000.00, // rate
        0.09975000 // amount
      ]
    ],
    "asks": [
      [
        "680", // order id
        1529491094, // timestamp
        997.50, // volume
        10000.00, // rate
        0.09975000 // amount
      ]
    ]
  }
}`
   */
  async books(symbol: string, limit: number) {
    const params = {
      sym: symbol,
      lmt: limit
    }
    return await this.apiSender('GET', params, '/api/market/books')
  }

  /**
   * Get historical data for TradingView chart.
   * @param symbol string The symbol (e.g. BTC_THB) !!!! BTC_THB it not th same other api
   * @param resolution string Chart resolution (1, 5, 15, 60, 240, 1D)
   * @param from int Timestamp of the starting time (e.g. 1633424427)
   * @param to int Timestamp of the starting time (e.g. 1633424427)
   * @returns `{
  "c": [
    1685000,
    1680699.95,
    1688998.99,
    1692222.22
  ],
  "h": [
    1685000,
    1685000,
    1689000,
    1692222.22
  ],
  "l": [
    1680053.22,
    1671000,
    1680000,
    1684995.07
  ],
  "o": [
    1682500,
    1685000,
    1680100,
    1684995.07
  ],
  "s": "ok",
  "t": [
    1633424400,
    1633425300,
    1633426200,
    1633427100
  ],
  "v": [
    4.604352630000001,
    8.530631670000005,
    4.836581560000002,
    2.8510189200000022
  ]
}`
   */
  async tradingviewHistory(symbol: string, resolution: string, from: number, to: number) {
    const params = {
      symbol: symbol,
      resolution: resolution,
      from: from,
      to: to,
    }
    return await this.apiSender('GET', params, '/tradingview/history')
  }

  /**
   * Get depth information.
   * @param symbol string The symbol (e.g. thb_btc)
   * @param limit int Depth size
   * @returns `{
  "asks": [
    [
      262600,
      0.61905798
    ],
    [
      263000,
      0.00210796
    ],
    [
      263200,
      0.89555545
    ],
    [
      263422.5,
      0.03796183
    ],
    [
      263499,
      0.4123439
    ]
  ],
  "bids": [
    [
      262510,
      0.38038703
    ],
    [
      262100.01,
      1.22519999
    ],
    [
      262100,
      0.00381533
    ],
    [
      262024.88,
      0.00352718
    ],
    [
      262001,
      0.09999961
    ]
  ]
}`
   */
  async depth(symbol: string, limit: number) {
    const params = {
      sym: symbol,
      lmt: limit
    }
    return await this.apiSender('GET', params, '/api/market/depth')
  }

  //////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Get user available balances (for both available and reserved balances please use POST /api/v3/market/balances).
   * @returns `{
  "error": 0,
  "result": {
    "THB": 188379.27,
    "BTC": 8.90397323,
    "ETH": 10.1
  }
}`
   */
  async wallet() {
    const params = {}
    return await this.apiSecureSender('POST', params, '/api/v3/market/wallet')
  }

  /**
   * Check trading credit balance.
   * @returns `{
   "error": 0,
   "result": 1000
}`
   */
  async userTradingCredits() {
    const params = {}
    return await this.apiSecureSender('POST', params, '/api/v3/user/trading-credits')
  }

  /**
   * Create a buy order.
   * @param symbol string The symbol you want to trade (e.g. btc_thb).
   * @param amount amt float Amount you want to spend with no trailing zero (e.g. 1000.00 is invalid, 1000 is ok)
   * @param rate float Rate you want for the order with no trailing zero (e.g. 1000.00 is invalid, 1000 is ok)
   * @param type string Order type: limit or market (for market order, please specify rat as 0)
   * @param client_id string your id for reference ( not required )
   * @returns `{
  "error": 0,
  "result": {
    "id": "1", // order id
    "hash": "fwQ6dnQWQPs4cbatF5Am2xCDP1J", // order hash
    "typ": "limit", // order type
    "amt": 1000, // spending amount
    "rat": 15000, // rate
    "fee": 2.5, // fee
    "cre": 2.5, // fee credit used
    "rec": 0.06666666, // amount to receive
    "ts": "1707220636" // timestamp
    "ci": "input_client_id" // input id for reference
  }
}`
   */
  async placeBid(symbol: string, amount: number, rate: number, type: string, client_id?: string) {
    const params = {
      sym: symbol,
      amt: amount,
      rat: rate,
      typ: type,
      client_id: client_id
    }
    return await this.apiSecureSender('POST', params, '/api/v3/market/v2/place-bid')
  }

  /**
   * Create a sell order.
   * @param symbol string The symbol. The symbol you want to trade (e.g. btc_thb).
   * @param amount float Amount you want to sell with no trailing zero (e.g. 0.10000000 is invalid, 0.1 is ok)
   * @param rate float Rate you want for the order with no trailing zero (e.g. 1000.00 is invalid, 1000 is ok)
   * @param type string Order type: limit or market (for market order, please specify rat as 0)
   * @param client_id string your id for reference ( not required )
   * @returns `{
  "error": 0,
  "result": {
    "id": "1", // order id
    "hash": "fwQ6dnQWQPs4cbatFGc9LPnpqyu", // order hash
    "typ": "limit", // order type
    "amt": 1.00000000, // selling amount
    "rat": 15000, // rate
    "fee": 37.5, // fee
    "cre": 37.5, // fee credit used
    "rec": 15000, // amount to receive
    "ts": "1533834844" // timestamp
    "ci": "input_client_id" // input id for reference
  }
}`
   */
  async placeAsk(symbol: string, amount: number, rate: number, type: string, client_id?: string) {
    const params = {
      sym: symbol,
      amt: amount,
      rat: rate,
      typ: type,
      client_id: client_id
    }
    return await this.apiSecureSender('POST', params, '/api/v3/market/place-ask')
  }

  /**
   * Cancel an open order.
   * @param symbol string The symbol. Please note that the current endpoint requires the symbol thb_btc. However, it will be changed to btc_thb soon and you will need to update the configurations accordingly for uninterrupted API functionality.
   * @param idorder string Order id you wish to cancel
   * @param side - string Order side: buy or sell
   * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
   * @returns `{
  "error": 0
}`
   */
  async cancelOrder(symbol: string, idorder: string, side: string, hash?: string) {
    const params = {
      sym: symbol,
      id: idorder,
      sd: side,
      hash: hash
    }
    return await this.apiSecureSender('POST', params, '/api/v3/market/cancel-order')
  }

  /**
   * Cancel an open order.
   * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
   * @returns `{
  "error": 0
}`
   */
  async cancelOrderHash(hash: string) {
    const params = {
      hash: hash
    }
    return await this.apiSecureSender('POST', params, '/api/v3/market/cancel-order')
  }

  /**
   * Get balances info: this includes both available and reserved balances.
   * @returns `{
  "error": 0,
  "result": {
    "THB":  {
      "available": 188379.27,
      "reserved": 0
    },
    "BTC": {
      "available": 8.90397323,
      "reserved": 0
    },
    "ETH": {
      "available": 10.1,
      "reserved": 0
    }
  }
}`
   */
  async balances() {
    const params = {}
    return await this.apiSecureSender('POST', params, '/api/v3/market/balances')
  }

  /**
   * List all open orders of the given symbol.
   * @param symbol string The symbol (e.g. btc_thb)
   * @returns `{
  "error": 0,
  "result": [
    { // Example of sell order
      "id": "2", // order id
      "hash": "fwQ6dnQWQPs4cbatFSJpMCcKTFR", // order hash
      "side": "sell", // order side
      "type": "limit", // order type
      "rate": "15000", // rate
      "fee": "35.01", // fee
      "credit": "35.01", // credit used
      "amount": "0.93333334", // amount of crypto quantity
      "receive": "14000", // amount of THB 
      "parent_id": "1", // parent order id
      "super_id": "1", // super parent order id
      "client_id": "client_id" // client id
      "ts": 1702543272000 // timestamp
    },
    { // Example of buy order
      "id": "278465822",
      "hash": "fwQ6dnQYKnqFPHx8sFM3z8oydmJ",
      "side": "buy",
      "type": "limit",
      "rate": "10",
      "fee": "0.25",
      "credit": "0",
      "amount": "100", // amount of THB 
      "receive": "9.975", // amount of crypto quantity
      "parent_id": "0",
      "super_id": "0",
      "client_id": "client_id",
      "ts": 1707220636000
    },
  ]
}`
   */
  async myOpenOrders(symbol: string) {
    const params = {
      sym: symbol
    }
    return await this.apiSecureSender('GET', params, '/api/v3/market/my-open-orders')
  }

  /**
   * List all orders that have already matched.
   * @param symbol string The symbol (e.g. btc_thb)
   * @param page int Page (optional)
   * @param limit int limit (optional)
   * @param start int Start  timestamp (optional)
   * @param end int End timestamp (optional)
   * @returns `{
  "error": 0,
  "result": [
    {
      "txn_id": "BTCSELL0021206932",
      "order_id": "241407793",
      "hash": "fwQ6dnYz5mbyeY9ssuqA74NmDej",
      "parent_order_id": "0",
      "parent_order_hash": "fwQ6dnQWQPs4cbatFGc8qWckMTH",
      "super_order_id": "0",
      "super_order_hash": "fwQ6dnQWQPs4cbatFGc8qWckMTH",
      "client_id": "",
      "taken_by_me": false,
      "is_maker": false,
      "side": "sell",
      "type": "market",
      "rate": "1525096.27",
      "fee": "0.04",
      "credit": "0",
      "amount": "0.00001", // crypto amount
      "ts": 1707221396584
    },
    {
      "txn_id": "BTCBUY0021182426",
      "order_id": "277231907",
      "hash": "fwQ6dnQYKnqFP3TPmYEajSfSbap",
      "parent_order_id": "0",
      "parent_order_hash": "fwQ6dnQWQPs4cbatF5Am2qegYs2",
      "super_order_id": "0",
      "super_order_hash": "fwQ6dnQWQPs4cbatF5Am2qegYs2",
      "client_id": "client_id",
      "taken_by_me": false,
      "is_maker": false,
      "side": "buy",
      "type": "market",
      "rate": "1497974.74",
      "fee": "0.03",
      "credit": "0",
      "amount": "11", // THB amount
      "ts": 1706775718739
    }
  ],
  "pagination": {
      "page": 2,
      "last": 3,
      "next": 3,
      "prev": 1
  }
}`
   */
  async myOrderHistory(symbol: string, page?: number, limit?: number, start?: number, end?: number) {
    const params = {
      sym: symbol,
      p: page,
      lmt: limit,
      start: start,
      end: end
    }
    return await this.apiSecureSender('GET', params, '/api/v3/market/my-order-history')
  }

  /**
   * Get information regarding the specified order.
   * @param symbol string The symbol (e.g. btc_thb)
   * @param ids string Order id
   * @param orderside - string Order side: buy or sell
   * @param hashorder - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
   * @returns `{
    "error": 0,
    "result": {
        "id": "289", // order id
        "first": "289", // first order id
        "parent": "0", // parent order id
        "last": "316", // last order id
        "amount": "4000", // order amount THB amount if it Buy side. And Crypto Amount if it sell side
        "rate": 291000, // order rate
        "fee": 10, // order fee
        "credit": 10, // order fee credit used
        "filled": 3999.97, // filled amount
        "total": 4000, // total amount
        "status": "filled", // order status: filled, unfilled, cancelled
        "partial_filled": false, // true when order has been partially filled, false when not filled or fully filled
        "remaining": 0, // remaining amount to be executed
        "history": [
            {
                "amount": 98.14848,
                "credit": 0.25,
                "fee": 0.25,
                "hash": "K9kLVGNVb9AVffm7t6U"
                "id": "289",
                "rate": 291000,
                "timestamp": 1702466375000,
                "txn_id": "BTCBUY0003372258"
            }
        ]
    }
}`
   */
  async orderInfo(symbol: string, ids: string, orderside: string, hashorder?: string) {
    const params = {
      sym: symbol,
      id: ids,
      sd: orderside,
      hash: hashorder
    }
    return await this.apiSecureSender('GET', params, '/api/v3/market/order-info')
  }

  /**
   * Get information regarding the specified order.
   * @param hash - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
   * @returns `{
    "error": 0,
    "result": {
        "id": "289", // order id
        "first": "289", // first order id
        "parent": "0", // parent order id
        "last": "316", // last order id
        "amount": "4000", // order amount THB amount if it Buy side. And Crypto Amount if it sell side
        "rate": 291000, // order rate
        "fee": 10, // order fee
        "credit": 10, // order fee credit used
        "filled": 3999.97, // filled amount
        "total": 4000, // total amount
        "status": "filled", // order status: filled, unfilled, cancelled
        "partial_filled": false, // true when order has been partially filled, false when not filled or fully filled
        "remaining": 0, // remaining amount to be executed
        "history": [
            {
                "amount": 98.14848,
                "credit": 0.25,
                "fee": 0.25,
                "hash": "K9kLVGNVb9AVffm7t6U"
                "id": "289",
                "rate": 291000,
                "timestamp": 1702466375000,
                "txn_id": "BTCBUY0003372258"
            }
        ]
    }
}`
   */
  async orderInfoHash(hash: string) {
    const params = {
      hash: hash
    }
    return await this.apiSecureSender('GET', params, '/api/v3/market/order-info')
  }

  /**
   * List all crypto addresses.
   * @param page int Page (optional)
   * @param limit int Limit (optional)
   * @returns `{
   "error":0,
   "result": [
      {
         "currency": "BTC",
         "address": "3BtxdKw6XSbneNvmJTLVHS9XfNYM7VAe8k",
         "tag": 0,
         "time": 1570893867
      }
   ],
   "pagination": {
      "page": 1,
      "last": 1
   }
}`
   */
  async cryptoAddresses(page?: number, limit?: number) {
    const params = {
      p: page,
      lmt: limit
    }
    return await this.apiSecureSender('POST', params, '/api/v3/crypto/addresses')
  }

  /**
   * Make a withdrawal to a trusted address.
   * For example ETH refers to ERC-20.
   * For request on ERC-20, please assign the net value as ETH.
   * For request on BEP-20, please assign the net value as BSC.
   * For request on KAP-20, please assign the net value as BKC.
   * @param cur string Currency for withdrawal (e.g. BTC, ETH)
   * @param amt float Amount you want to withdraw
   * @param adr string Address to which you want to withdraw
   * @param mem string (Optional) Memo or destination tag to which you want to withdraw
   * @param net string Cryptocurrency network to withdraw
   * @returns `{
    "error": 0,
    "result": {
        "txn": "BTCWD0000012345", // local transaction id
        "adr": "4asyjKw6XScneNvhJTLVHS9XfNYM7VBf8x", // address
        "mem": "", // memo
        "cur": "BTC", // currency
        "amt": 0.1, // withdraw amount
        "fee": 0.0002, // withdraw fee
        "ts": 1569999999 // timestamp
    }
}`
   */
  async cryptoWithdraw(cur: string, amt: number, adr: string, mem: string, net: string) {
    const params = {
      cur: cur,
      amt: amt,
      adr: adr,
      mem: mem,
      net: net
    }
    return await this.apiSecureSender('POST', params, '/api/v3/crypto/withdraw')
  }

  /**
   * Make a withdraw to an internal address. The destination address is not required to be a trusted address. This API is not enabled by default, Only KYB users can request this feature by contacting us via support@bitkub.com
   * @param cur string Currency for withdrawal (e.g. BTC, ETH)
   * @param amt float Amount you want to withdraw
   * @param adr string Address to which you want to withdraw
   * @param mem string (Optional) Memo or destination tag to which you want to withdraw
   * @param net string Cryptocurrency network to withdraw 
   * @returns
   */
  async cryptoInternalWithdraw(cur: string, amt: number, adr: string, mem: string, net: string) {
    const params = {
      cur: cur,
      amt: amt,
      adr: adr,
      mem: mem,
      net: net
    }
    return await this.apiSecureSender('POST', params, '/api/v3/crypto/internal-withdraw')
  }

  /**
   * List crypto deposit history.
   * @param page int Page (optional)
   * @param limit int Limit (optional)
   * @returns `{
   "error": 0,
   "result": [
      {
         "hash": "XRPWD0000100276",
         "currency": "XRP",
         "amount": 5.75111474,
         "from_address": "sender address",
         "to_address": "recipient address",
         "confirmations": 1,
         "status": "complete",
         "time": 1570893867
      }
   ],
   "pagination": {
      "page": 1,
      "last": 1
   }
}`
   */
  async cryptoDepositHistory(page?: number, limit?: number) {
    const params = {
      p: page,
      lmt: limit
    }
    return await this.apiSecureSender('POST', params, '/api/v3/crypto/deposit-history')
  }

  /**
   * List crypto withdrawal history.
   * @param page int Page (optional)
   * @param limit int Limit (optional)
   * @returns `{
   "error": 0,
   "result": [
      {
         "txn_id": "XRPWD0000100276",
         "hash": "send_internal",
         "currency": "XRP",
         "amount": "5.75111474",
         "fee": 0.01,
         "address": "rpXTzCuXtjiPDFysxq8uNmtZBe9Xo97JbW",
         "status": "complete",
         "time": 1570893493
      }
   ],
   "pagination": {
      "page": 1,
      "last": 1
   }
}`
   */
  async cryptoWithdrawHistory(page?: number, limit?: number) {
    const params = {
      p: page,
      lmt: limit
    }
    return await this.apiSecureSender('POST', params, '/api/v3/crypto/withdraw-history')
  }

  /**
   * Generate a new crypto address (will replace existing address; previous address can still be used to received funds)
   * @param symbol string Symbol (e.g. THB_BTC, THB_ETH, etc.)
   * @returns `{
   "error": 0,
   "result": [
      {
         "currency": "ETH",
         "address": "0x520165471daa570ab632dd504c6af257bd36edfb",
         "memo": ""
      }
   ]
}`
   */
  async cryptoGenerateAddress(symbol: string) {
    const params = {
      sym: symbol
    }
    return await this.apiSecureSender('POST', params, '/api/v3/crypto/generate-address')
  }

  /**
   * List all approved bank accounts.
   * @param page int Page (optional)
   * @param limit int Limit (optional)
   * @returns `{
   "error": 0,
   "result": [
      {
         "id": "7262109099",
         "bank": "Kasikorn Bank",
         "name": "Somsak",
         "time": 1570893867
      }
   ],
   "pagination": {
      "page": 1,
      "last": 1
   }
}`
   */
  async fiatAccounts(page?: number, limit?: number) {
    const params = {
      p: page,
      lmt: limit
    }
    return await this.apiSecureSender('POST', params, '/api/v3/fiat/accounts')
  }

  /**
   * Make a withdrawal to an approved bank account.
   * @param idbank string Bank account id
   * @param amount float Amount you want to withdraw
   * @returns `{
    "error": 0,
    "result": {
        "txn": "THBWD0000012345", // local transaction id
        "acc": "7262109099", // bank account id
        "cur": "THB", // currency
        "amt": 21, // withdraw amount
        "fee": 20, // withdraw fee
        "rec": 1, // amount to receive
        "ts": 1569999999 // timestamp
    }
}`
   */
  async fiatWithdraw(idbank: string, amount: number) {
    const params = {
      id: idbank,
      amt: amount
    }
    return await this.apiSecureSender('POST', params, '/api/v3/fiat/withdraw')
  }

  /**
   * List fiat deposit history.
   * @param page int Page (optional)
   * @param limit int Limit (optional)
   * @returns `{
   "error": 0,
   "result": [
      {
         "txn_id": "THBDP0000012345",
         "currency": "THB",
         "amount": 5000.55,
         "status": "complete",
         "time": 1570893867
      }
   ],
   "pagination": {
      "page": 1,
      "last": 1
   }
}`
   */
  async fiatDepositHistory(page?: number, limit?: number) {
    const params = {
      p: page,
      lmt: limit
    }
    return await this.apiSecureSender('POST', params, '/api/v3/fiat/deposit-history')
  }

  /**
   * List fiat withdrawal history.
   * @param page int Page (optional)
   * @param limit int Limit (optional)
   * @returns `{
   "error":0,
   "result": [
      {
         "txn_id": "THBWD0000012345",
         "currency": "THB",
         "amount": "21",
         "fee": 20,
         "status": "complete",
         "time": 1570893493
      }
   ],
   "pagination": {
      "page": 1,
      "last": 1
   }
}`
   */
  async fiatWithdrawHistory(page?: number, limit?: number) {
    const params = {
      p: page,
      lmt: limit
    }
    return await this.apiSecureSender('POST', params, '/api/v3/fiat/withdraw-history')
  }

  /**
   * Check deposit/withdraw limitations and usage.
   * @returns {
   "error": 0,
   "result": { 
       "limits": { // limitations by kyc level
          "crypto": { 
             "deposit": 0.88971929, // BTC value equivalent
             "withdraw": 0.88971929 // BTC value equivalent
          },
          "fiat": { 
             "deposit": 200000, // THB value equivalent
             "withdraw": 200000 // THB value equivalent
          }
       },
       "usage": { // today's usage
          "crypto": { 
             "deposit": 0, // BTC value equivalent
             "withdraw": 0, // BTC value equivalent
             "deposit_percentage": 0,
             "withdraw_percentage": 0,
             "deposit_thb_equivalent": 0, // THB value equivalent
             "withdraw_thb_equivalent": 0 // THB value equivalent
          },
          "fiat": { 
             "deposit": 0, // THB value equivalent
             "withdraw": 0, // THB value equivalent
             "deposit_percentage": 0,
             "withdraw_percentage": 0
          }
       },
       "rate": 224790 // current THB rate used to calculate
    }
}`
   */
  async userLimits() {
    const params = {
    }
    return await this.apiSecureSender('POST', params, '/api/v3/user/limits')
  }

  //////////////////////////////////////////////////////////////////////////////////////

  private checkData(data: any) {
    if (data.errordata) data = { error: data }
    else if (data.error !== 0) data = { error: this.geterrorDescription(data.error) }
    return data
  }

  private geterrorDescription(errcode: number): string {
    switch (errcode) {
      case 0:
        return 'No error'
      case 1:
        return 'Invalid JSON payload'
      case 2:
        return 'Missing X-BTK-APIKEY'
      case 3:
        return 'Invalid API key'
      case 4:
        return 'API pending for activation'
      case 5:
        return 'IP not allowed'
      case 6:
        return 'Missing / invalid signature'
      case 7:
        return 'Missing timestamp'
      case 8:
        return 'Invalid timestamp'
      case 9:
        return 'Invalid user'
      case 10:
        return 'Invalid parameter'
      case 11:
        return 'Invalid symbol'
      case 12:
        return 'Invalid amount'
      case 13:
        return 'Invalid rate'
      case 14:
        return 'Improper rate'
      case 15:
        return 'Amount too low'
      case 16:
        return 'Failed to get balance'
      case 17:
        return 'Wallet is empty'
      case 18:
        return 'Insufficient balance'
      case 19:
        return 'Failed to insert order into db'
      case 20:
        return 'Failed to deduct balance'
      case 21:
        return 'Invalid order for cancellation'
      case 22:
        return 'Invalid side'
      case 23:
        return 'Failed to update order status'
      case 24:
        return 'Invalid order for lookup'
      case 25:
        return 'KYC level 1 is required to proceed'
      case 30:
        return 'Limit exceeds'
      case 40:
        return 'Pending withdrawal exists'
      case 41:
        return 'Invalid currency for withdrawal'
      case 42:
        return 'Address is not in whitelist'
      case 43:
        return 'Failed to deduct crypto'
      case 44:
        return 'Failed to create withdrawal record'
      case 45:
        return 'Nonce has to be numeric'
      case 46:
        return 'Invalid nonce'
      case 47:
        return 'Withdrawal limit exceeds'
      case 48:
        return 'Invalid bank account'
      case 49:
        return 'Bank limit exceeds'
      case 50:
        return 'Pending withdrawal exists'
      case 51:
        return 'Withdrawal is under maintenance'
      case 52:
        return 'Invalid permission'
      case 53:
        return 'Invalid internal address'
      case 54:
        return 'Address has been deprecated'
      case 55:
        return 'Cancel only mode'
      case 56:
        return 'User has been suspended from purchasing'
      case 57:
        return 'User has been suspended from selling'
      case 90:
        return 'Server error (please contact support)'
      default:
        return 'Unexpected problems'
    }
  }
}


