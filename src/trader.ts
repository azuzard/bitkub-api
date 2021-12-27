import { BitkubAPI } from "./BitkubAPI";

const bitkubAPI = new BitkubAPI();
const res = async () =>
    console.log(await bitkubAPI.tradingview("THB_XLM", "1", Date.now() - 1000 * 60 * 5, Date.now()));

// const res = async () => console.log(await bitkubAPI.placebid('THB_XLM', 1000000, 10, 'limit'));
res();
// let a = new Date("11-1-2021");
// console.log(a.valueOf());
