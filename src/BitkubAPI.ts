import axios from "axios";
import { createHmac } from "crypto"; // just used one time.
import "dotenv/config.js";

// TODO How to use.
// import  BitkubAPI from "./BitkubAPI";
// const bitkubAPI = new BitkubAPI();
// const res = async () => console.log(await bitkubAPI.ticker('THB_XLM'));
// const res = async () => console.log(await bitkubAPI.placebid('THB_XLM', 1000000, 10, 'limit'));
// res();
export class BitkubAPI {
    constructor(key?: string, secret?: string) {
        this.key = key ?? process.env.API_KEY_KUB ?? "not found";
        this.secret = secret ?? process.env.API_SECRET_KUB ?? "not found";
    }

    key: string;
    secret: string;
    BITKUB_ROOT_URL = process.env.BITKUB_ROOT_URL ?? "https://api.bitkub.com"; // to Public the constant.

    private async apiSecureSender(req: any, params: any, urlapi: string) {
        try {
            this.checknokey();
            params.sig = this.signTime(params);
            const { data } = await axios({
                method: req,
                url: this.BITKUB_ROOT_URL + urlapi,
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "X-BTK-APIKEY": this.key,
                },
                data: params,
            });
            return data;
        } catch (error) {
            return { errordata: error };
        }
    }

    private async apiSender(req: any, params: any, urlapi: string) {
        try {
            this.checknokey();
            // const { data, status, statusText, headers, config, request }
            const { data } = await axios({
                method: req,
                url: this.BITKUB_ROOT_URL + urlapi,
                params: params,
            });

            return data;
        } catch (error) {
            return { errordata: error };
        }
    }

    private checknokey() {
        if (this.key == "not found" || this.secret == "not found") throw new Error("key not found");
    }

    private signTime(time: any) {
        const digest = createHmac("sha256", this.secret).update(JSON.stringify(time)).digest("hex");
        return digest;
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async status() {
        const params = {};
        const data = await this.apiSender("get", params, "/api/status");
        if (data.errordata) return { error: data }; // unknown error
        return data;
    }

    async servertime() {
        const params = {};
        const data = await this.apiSender("get", params, "/api/servertime");
        if (data.errordata) return { error: data };
        return { time: data }; // json it.
    }

    async symbols() {
        const params = {};
        const data = await this.apiSender("get", params, "/api//market/symbols");
        if (data.errordata) return { error: data }; // unknown error
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) }; // bitkub error
        return data;
    }

    async ticker(symbol?: string) {
        const params = {
            sym: symbol, // string The symbol (optional)
        };
        const data = await this.apiSender("get", params, "/api/market/ticker");
        if (data.errordata) return { error: data };
        return data;
    }

    async trades(symbol: string, limit: number) {
        const params = {
            sym: symbol, // string The symbol
            lmt: limit, //  int No. of limit to query recent trades
        };
        const data = await this.apiSender("get", params, "/api/market/trades");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async bids(symbol: string, limit: number) {
        const params = {
            sym: symbol, // string The symbol
            lmt: limit, //  int No. of limit to query open buy orders
        };
        const data = await this.apiSender("get", params, "/api/market/bids");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async asks(symbol: string, limit: number) {
        const params = {
            sym: symbol, // string The symbol
            lmt: limit, //  int No. of limit to query open sell orders
        };
        const data = await this.apiSender("get", params, "/api/market/asks");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async books(symbol: string, limit: number) {
        const params = {
            sym: symbol, // string The symbol
            lmt: limit, //  int No. of limit to query open orders
        };
        const data = await this.apiSender("get", params, "/api/market/books");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async tradingview(symbol: string, resolution: string, from: number, to: number) {
        const params = {
            symbol: symbol, // string The symbol (e.g. BTC_THB) !!!! BTC_THB it not th same other api
            resolution: resolution, // string Chart resolution (1, 5, 15, 60, 240, 1D)
            from: from, // int Timestamp of the starting time (e.g. 1633424427)
            to: to, // int Timestamp of the starting time (e.g. 1633424427)
        };
        const data = await this.apiSender("get", params, "/tradingview/history");
        if (data.errordata) return { error: data };
        return data;
    }

    async depth(symbol: string, limit: number) {
        const params = {
            sym: symbol, // string The symbol
            lmt: limit, //  int Depth size
        };
        const data = await this.apiSender("get", params, "/api/market/depth");
        if (data.errordata) return { error: data };
        return data;
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async wallet() {
        const params = { ts: Date.now() };
        const data = await this.apiSecureSender("post", params, "/api/market/wallet");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async balances() {
        const params = { ts: Date.now() };
        const data = await this.apiSecureSender("post", params, "/api/market/balances");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async placebid(symbol: string, amount: number, rate: number, type: string, strid?: string) {
        const params = {
            sym: symbol, // string The symbol
            amt: amount, // float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            rat: rate, // float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            typ: type, // string Order type: limit or market (for market order, please specify rat as 0)
            client_id: strid, // string your id for reference ( no required )
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/place-bid");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async placebidtest(symbol: string, amount: number, rate: number, type: string, strid?: string) {
        const params = {
            sym: symbol, // string The symbol
            amt: amount, // float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            rat: rate, // float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            typ: type, // string Order type: limit or market (for market order, please specify rat as 0)
            client_id: strid, // string your id for reference ( no required )
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/place-bid/test");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async placeask(symbol: string, amount: number, rate: number, type: string, strid?: string) {
        const params = {
            sym: symbol, // string The symbol
            amt: amount, // float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
            rat: rate, // float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            typ: type, // string Order type: limit or market (for market order, please specify rat as 0)
            client_id: strid, // string your id for reference ( no required )
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/place-ask");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async placeasktest(symbol: string, amount: number, rate: number, type: string, strid?: string) {
        const params = {
            sym: symbol, // string The symbol
            amt: amount, // float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
            rat: rate, // float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            typ: type, // string Order type: limit or market (for market order, please specify rat as 0)
            client_id: strid, // string your id for reference ( no required )
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/place-ask/test");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async placeaskbyfiat(symbol: string, amount: number, rate: number, type: string) {
        const params = {
            sym: symbol, // string The symbol
            amt: amount, // float Fiat amount you want to receive with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            rat: rate, // float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
            typ: type, // string Order type: limit or market
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/place-ask-by-fiat");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async cancelorder(symbol: string, idorder: number, side: string, hash?: string) {
        const params = {
            sym: symbol, // string The symbol
            id: idorder, // int Order id you wish to cancel
            sd: side, // string Order side: buy or sell
            hash: hash, // string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/cancel-order");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return { msg: "success" }; // to json
    }

    async myopenorders(symbol: string) {
        const params = {
            sym: symbol, // string The symbol
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/my-open-orders");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async myorderhistory(symbol: string, page?: number, limit?: number, start?: number, end?: number) {
        const params = {
            sym: symbol, // string The symbol
            p: page, // int Page (optional)
            lmt: limit, // int limit (optional)
            start: start, // int Start  timestamp (optional)
            end: end, // int End timestamp (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/my-order-history");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async orderinfo(symbol: string, ids: number, orderside: string, hashorder?: string) {
        const params = {
            sym: symbol, // string The symbol
            id: ids, // int Order id
            sd: orderside, // string Order side: buy or sell
            hash: hashorder, // string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/order-info");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async cryptoaddresses(page?: number, limit?: number) {
        const params = {
            p: page, // int Page (optional)
            lmt: limit, // int Limit (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/crypto/addresses");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async cryptowithdraw(cur: string, amt: number, adr: string, mem?: string) {
        const params = {
            cur: cur, // string Currency for withdrawal (e.g. BTC, ETH)
            amt: amt, // float Amount you want to withdraw
            adr: adr, // string Address to which you want to withdraw
            mem: mem, // string (Optional) Memo or destination tag to which you want to withdraw
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/crypto/withdraw");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async cryptointernalwithdraw(cur: string, amt: number, adr: string, mem?: string) {
        const params = {
            cur: cur, // string Currency for withdrawal (e.g. BTC, ETH)
            amt: amt, // float Amount you want to withdraw
            adr: adr, // string Address to which you want to withdraw
            mem: mem, // string (Optional) Memo or destination tag to which you want to withdraw
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/crypto/internal-withdraw");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }
    async cryptodeposithistory(page?: number, limit?: number) {
        const params = {
            p: page, // int Page (optional)
            lmt: limit, // int Limit (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/crypto/deposit-history");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async cryptowithdrawhistory(page?: number, limit?: number) {
        const params = {
            p: page, // int Page (optional)
            lmt: limit, // int Limit (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/crypto/withdraw-history");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async cryptogenerateaddress(symbol: string) {
        const params = {
            sym: symbol, // string Symbol (e.g. THB_BTC, THB_ETH, etc.)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/crypto/generate-address");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async accounts(page?: number, limit?: number) {
        const params = {
            p: page, // int Page (optional)
            lmt: limit, // int Limit (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/fiat/accounts");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async withdraw(idbank: string, amount: number) {
        const params = {
            id: idbank, // string Bank account id
            amt: amount, // float Amount you want to withdraw
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/fiat/withdraw");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async deposithistory(page?: number, limit?: number) {
        const params = {
            p: page, // int Page (optional)
            lmt: limit, // int Limit (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/fiat/deposit-history");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async withdrawhistory(page?: number, limit?: number) {
        const params = {
            p: page, // int Page (optional)
            lmt: limit, // int Limit (optional)
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/fiat/withdraw-history");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async wstoken() {
        const params = {
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/market/wstoken");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async limits() {
        const params = {
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/user/limits");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    async tradingcredits() {
        const params = {
            ts: Date.now(),
        };
        const data = await this.apiSecureSender("post", params, "/api/user/trading-credits");
        if (data.errordata) return { error: data };
        if (data.error !== 0) return { error: this.geterrorDescription(data.error) };
        return data;
    }

    private geterrorDescription(errcode: number) {
        switch (errcode) {
            case 0:
                return "No error";
            case 1:
                return "Invalid JSON payload";
            case 2:
                return "Missing X-BTK-APIKEY";
            case 3:
                return "Invalid API key";
            case 4:
                return "API pending for activation";
            case 5:
                return "IP not allowed";
            case 6:
                return "Missing / invalid signature";
            case 7:
                return "Missing timestamp";
            case 8:
                return "Invalid timestamp";
            case 9:
                return "Invalid user";
            case 10:
                return "Invalid parameter";
            case 11:
                return "Invalid symbol";
            case 12:
                return "Invalid amount";
            case 13:
                return "Invalid rate";
            case 14:
                return "Improper rate";
            case 15:
                return "Amount too low";
            case 16:
                return "Failed to get balance";
            case 17:
                return "Wallet is empty";
            case 18:
                return "Insufficient balance";
            case 19:
                return "Failed to insert order into db";
            case 20:
                return "Failed to deduct balance";
            case 21:
                return "Invalid order for cancellation";
            case 22:
                return "Invalid side";
            case 23:
                return "Failed to update order status";
            case 24:
                return "Invalid order for lookup";
            case 25:
                return "KYC level 1 is required to proceed";
            case 30:
                return "Limit exceeds";
            case 40:
                return "Pending withdrawal exists";
            case 41:
                return "Invalid currency for withdrawal";
            case 42:
                return "Address is not in whitelist";
            case 43:
                return "Failed to deduct crypto";
            case 44:
                return "Failed to create withdrawal record";
            case 45:
                return "Nonce has to be numeric";
            case 46:
                return "Invalid nonce";
            case 47:
                return "Withdrawal limit exceeds";
            case 48:
                return "Invalid bank account";
            case 49:
                return "Bank limit exceeds";
            case 50:
                return "Pending withdrawal exists";
            case 51:
                return "Withdrawal is under maintenance";
            case 52:
                return "Invalid permission";
            case 53:
                return "Invalid internal address";
            case 54:
                return "Address has been deprecated";
            case 90:
                return "Server error (please contact support)";
            default:
                return "Unexpect problems";
        }
    }
}

// export default BitkubAPI;
