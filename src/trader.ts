import BitkubAPI from "./BitkubAPI";
const bitkubAPI = new BitkubAPI();
const res = async () => console.log(await bitkubAPI.ticker("THB_XLM"));
// const res = async () => console.log(await bitkubAPI.placebid('THB_XLM', 1000000, 10, 'limit'));
res();
