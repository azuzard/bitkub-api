import { BitkubAPI } from "./BitkubAPI.js";

const bitkubAPI = new BitkubAPI();
// const res = async () =>
//     console.log(
//         await bitkubAPI.tradingview(
//             "SNT_THB",
//             "1",
//             Math.trunc(Date.now() / 1000) - 60 * 150,
//             Math.trunc(Date.now() / 1000)
//         )
//     );

const res1 = async () => console.log(await bitkubAPI.myopenorders("THB_SNT"));
const res2 = async () => {
    const res = await bitkubAPI.balances();
    console.log(`THB : ${res.result.THB.available} | SNT : ${res.result.SNT.reserved}`);
};
res1();
res2();
// let a = new Date("11-1-2021");

import WebSocket, { WebSocketServer } from "ws";
let tradeStart = false;
if (tradeStart) {
    const socket = new WebSocket("wss://api.bitkub.com/websocket-api/market.ticker.thb_snt");

    socket.onopen = function (e) {
        console.log("[open] Connection established");
        // console.log("Sending to server");
        // socket.send("My name is John");
    };

    socket.onmessage = async function (event) {
        try {
            if (event.data) {
                const coinPrice = await JSON.parse(event.data.toString().split("\n")[0]); //! [0] coz somtime it send multiple data
                console.log(
                    `[${coinPrice.stream}] : ${coinPrice.last} | ${coinPrice.highestBid} | ${coinPrice.lowestAsk}`
                );
                if (coinPrice.last >= 3.2) {
                    console.log("Sell : 3.2");
                }
            } else {
                console.log("data failed");
            }
        } catch (error) {
            console.error(`[message] : ${error}`);
        }
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log("[close] Connection died");
        }
    };

    socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };
}
