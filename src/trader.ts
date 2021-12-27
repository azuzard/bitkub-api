import { BitkubAPI } from "./BitkubAPI.js";

const bitkubAPI = new BitkubAPI();
const res = async () =>
    console.log(
        await bitkubAPI.tradingview(
            "SNT_THB",
            "1",
            Math.trunc(Date.now() / 1000) - 60 * 150,
            Math.trunc(Date.now() / 1000)
        )
    );

// const res = async () => console.log(await bitkubAPI.placebid('THB_XLM', 1000000, 10, 'limit'));
res();
// let a = new Date("11-1-2021");
// console.log(a.valueOf());

export default {};
