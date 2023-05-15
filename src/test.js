import Bitkubapi from "./bitkubapi.js";
const bitkubapi = new Bitkubapi("30cc2acadc1059a90d53e99cb476ca65", "21fecae001af0e326e4a4399d45f7c19");
// const res = async () => console.log(await bitkubapi.ticker("THB_DOGE"));
// const res = async () => console.log(await bitkubapi.placebid("THB_KUB", 100, 100, 101, "stop"));
// res();

let cdata = [];
let candledata = await bitkubapi.tradingview("SNT_THB", "1", Math.trunc(Date.now() / 1000) - 60 * 150, Math.trunc(Date.now() / 1000));
candledata.t.forEach((e,i) => {
    // console.log(candledata.t[i]);

    cdata.push({
        time: candledata.t[i],
        open: candledata.o[i],
        high: candledata.h[i],
        low: candledata.l[i],
        close: candledata.c[i],
    });
});
// const cdata = candledata.map((d) => {
//     return { time: d.t, open: d.o, high: d.h, low: d.l, close: d.c };
// });

// console.log(candledata);
console.log(cdata);
