import { BitkubApi } from "./bitkubApi.js"
import WebSocket from "ws"

const bitkubapi = new BitkubApi("30cc2acadc1059a90d53e99cb476ca65", "21fecae001af0e326e4a4399d45f7c19")
// const res = async () => console.log(await bitkubapi.tradingview("SNT_THB", "1", Math.trunc(Date.now() / 1000) - 60 * 150, Math.trunc(Date.now() / 1000)));
// const res1 = async () => console.log(await bitkubapi.myopenorders("THB_SNT"));
const mybalance = async () => {
  const res = await bitkubapi.balances()
  console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.available}`)
  return res.result.SNT.available
  // console.table(res.result);
}
const myorder = async () => {
  const res = await bitkubapi.myOpenOrders("THB_KUB")
  // console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);

  // const orderres = res.result.find((e: { rate: string }) => e.rate == "25.00")
  console.log(res)
  // console.table(res.result);
}
const myorderhistory = async () => {
  const res = await bitkubapi.myOrderHistory("THB_KUB")
  // console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);
  console.log(res)
  // console.table(res.result);
}
const mysell = async () => {
  const res = await bitkubapi.placeAsk("THB_KUB", 0.5, 60, "limit")
  // console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);
  console.log(res)
  // console.table(res.result);
}
const mybuy = async () => {
  const res = await bitkubapi.placeBid("THB_KUB", 0.5, 60, "limit")
  // console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);
  console.log(res)
  // console.table(res.result);
}
const cancleAll = async () => {
  const mybalances = await bitkubapi.balances()
  let mybalancesReserved = mybalances.result,
    key
  for (key in mybalancesReserved) {
    if (mybalancesReserved[key].reserved == 0) delete mybalancesReserved[key]
  }
  for (key in mybalancesReserved) {
    let openorder = await bitkubapi.myOpenOrders("THB_" + key)
    let cancelorder = await bitkubapi.cancelOrder("THB_" + key, 0, "", openorder.result[0].hash)
    console.log(openorder)
    console.log(cancelorder)
  }

  console.log(mybalancesReserved)
  // console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);
  // console.log(res);
  // console.table(res.result);
}
const lastPrice = async (symbol: string) => {
  const res = await bitkubapi.ticker(symbol)
  return res.error ? res : res[symbol]["last"]
  // if (res) return { error: "not found" };
}
// cancleAll();
// res();
// res1();
myorder()
// mysell()
trader(false)

let upper = 80
let lower = 30
let numberofgrid = 10
// griddata.grid = [20]
let griddata = { gridprice: [numberofgrid], avaliable: new Array<boolean>(numberofgrid), tax: new Array<string>(numberofgrid) }
let diff = (upper - lower) / numberofgrid
for (let index = 0; index < numberofgrid + 1; index++) {
  griddata.gridprice[index] = lower + index * diff
  griddata.avaliable[index] = false
  griddata.tax[index] = ""
}
console.table(griddata)
// griddata.grid[0] = 20.0

async function trader(tradeStart: boolean) {
  // let myvolume = await mybalance();
  // console.log(myvolume);

  if (tradeStart) {
    const socket = new WebSocket("wss://api.bitkub.com/websocket-api/market.ticker.thb_kub")

    socket.onopen = async function (e) {
      console.log("[open] Connection established")
      // console.log("Sending to server");
      // socket.send("My name is John");
    }

    socket.onmessage = async function (event) {
      try {
        // const expectPrice = 2.4
        // const expectPriceBand = (2.4 * 0.01).toFixed(2)

        const lastcoinPrice = await checkLastPrice()

        if (lower <= lastcoinPrice.last && lastcoinPrice.last <= upper) {
          const ongrid = Math.floor((lastcoinPrice.last - lower) / diff)
          console.log("grid", griddata.gridprice[ongrid])

          const res = await bitkubapi.myOpenOrders("THB_KUB")
          // console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);

          const orderres = res.result.find((e: { rate: string }) => e.rate == "25.00")
          // console.log(orderres)

          if (orderres == undefined) {
            // await bitkubapi.placebuy("THB_KUB", 100, griddata.grid[ongrid], "limit"));
            console.log("buy: ", griddata.gridprice[ongrid])
            griddata.avaliable[ongrid] = true
          }
          // else {
          //     // await bitkubapi.placeark("THB_KUB", 1, griddata.grid[ongrid+1], "limit"));
          //     console.log("sell: ", griddata.gridprice[ongrid + 1])
          //     // griddata.avaliable[ongrid] = false
          // }
        }
        // if (lastcoinPrice.last > expectPrice + expectPriceBand && myvolume < 460) {
        //     myvolume = myvolume + 10;
        //     console.log(await bitkubapi.placebid("THB_SNT", 20, expectPrice, "limit"));
        // }
      } catch (error) {
        console.error(`[message] : ${error}`)
      }

      async function checkLastPrice() {
        if (event.data) {
          const lastcoinPrice = await JSON.parse(event.data.toString().split("\n")[0]) //! [0] coz somtime it send multiple data
          console.log(`[${lastcoinPrice.stream}] : ${lastcoinPrice.last} | ${lastcoinPrice.highestBid} | ${lastcoinPrice.lowestAsk}`)
          return lastcoinPrice
        } else {
          console.log("price data failed")
        }
      }
    }

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("[close] Connection died")
      }
    }

    socket.onerror = function (error) {
      console.log(`[error] ${error.message}`)
    }
  }
}
