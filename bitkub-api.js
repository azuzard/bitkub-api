var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "axios", "crypto"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BitkubApi = void 0;
    const axios_1 = __importDefault(require("axios"));
    const crypto_1 = require("crypto"); // just used one time.
    // TODO How to use.
    // import { BitkubApi } from "./BitkubApi"
    // const bitkubApi = new BitkubApi()
    // const res = async () => console.log(await bitkubApi.ticker("THB_XLM"))
    // const res = async () => console.log(await bitkubApi.placeBid("THB_XLM", 1000000, 10, "limit"))
    // res()
    class BitkubApi {
        constructor(key, secret) {
            this.key = key ?? process.env.API_KEY_KUB ?? 'nokey';
            this.secret = secret ?? process.env.API_SECRET_KUB ?? 'nokey';
        }
        key;
        secret;
        BITKUB_ROOT_URL = process.env.BITKUB_ROOT_URL ?? 'https://api.bitkub.com'; // to Public the constant.
        async apiSecureSender(req, params, urlapi) {
            try {
                this.checknokey();
                params.sig = (0, crypto_1.createHmac)('sha256', this.secret).update(JSON.stringify(params)).digest('hex');
                const { data } = await (0, axios_1.default)({
                    method: req,
                    url: this.BITKUB_ROOT_URL + urlapi,
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                        'X-BTK-APIKEY': this.key,
                    },
                    data: params,
                });
                return data;
            }
            catch (error) {
                return { errordata: error };
            }
        }
        async apiSender(req, params, urlapi) {
            try {
                // const { data, status, statusText, headers, config, request }
                const { data } = await (0, axios_1.default)({
                    method: req,
                    url: this.BITKUB_ROOT_URL + urlapi,
                    params: params,
                });
                return data;
            }
            catch (error) {
                return { errordata: error };
            }
        }
        checknokey() {
            if (this.key == 'nokey' || this.secret == 'nokey')
                throw 'key not found';
        }
        //////////////////////////////////////////////////////////////////////////////////////////
        async status() {
            const params = {};
            const data = await this.apiSender('get', params, '/api/status');
            if (data.errordata)
                return { error: data }; // unknown error
            return data;
        }
        async servertime() {
            const params = {};
            const data = await this.apiSender('get', params, '/api/servertime');
            if (data.errordata)
                return { error: data };
            return { time: data }; // json it.
        }
        async symbols() {
            const params = {};
            const data = await this.apiSender('get', params, '/api//market/symbols');
            if (data.errordata)
                return { error: data }; // unknown error
            if (data.error !== 0)
                return { error: this.geterrorDescription(data.error) }; // bitkub error
            return data;
        }
        async ticker(symbol) {
            const params = {
                sym: symbol, // string The symbol (optional)
            };
            const data = await this.apiSender('get', params, '/api/market/ticker');
            if (data.errordata)
                return { error: data };
            return data;
        }
        async trades(symbol, limit) {
            const params = {
                sym: symbol,
                lmt: limit, //  int No. of limit to query recent trades
            };
            const data = await this.apiSender('get', params, '/api/market/trades');
            return this.checkData(data);
        }
        async bids(symbol, limit) {
            const params = {
                sym: symbol,
                lmt: limit, //  int No. of limit to query open buy orders
            };
            const data = await this.apiSender('get', params, '/api/market/bids');
            return this.checkData(data);
        }
        async asks(symbol, limit) {
            const params = {
                sym: symbol,
                lmt: limit, //  int No. of limit to query open sell orders
            };
            const data = await this.apiSender('get', params, '/api/market/asks');
            return this.checkData(data);
        }
        async books(symbol, limit) {
            const params = {
                sym: symbol,
                lmt: limit, //  int No. of limit to query open orders
            };
            const data = await this.apiSender('get', params, '/api/market/books');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol (e.g. BTC_THB) !!!! BTC_THB it not th same other api
         * @param resolution - string Chart resolution (1, 5, 15, 60, 240, 1D)
         * @param from -  int Timestamp of the starting time (e.g. 1633424427)
         * @param to - int Timestamp of the starting time (e.g. 1633424427)
         * @returns
         */
        async tradingviewHistory(symbol, resolution, from, to) {
            const params = {
                symbol: symbol,
                resolution: resolution,
                from: from,
                to: to,
            };
            const data = await this.apiSender('get', params, '/tradingview/history');
            if (data.errordata)
                return { error: data };
            return data;
        }
        async depth(symbol, limit) {
            const params = {
                sym: symbol,
                lmt: limit, //  int Depth size
            };
            const data = await this.apiSender('get', params, '/api/market/depth');
            if (data.errordata)
                return { error: data };
            return data;
        }
        //////////////////////////////////////////////////////////////////////////////////////////
        async wallet() {
            const params = { ts: Date.now() };
            const data = await this.apiSecureSender('post', params, '/api/market/wallet');
            return this.checkData(data);
        }
        async balances() {
            const params = { ts: Date.now() };
            const data = await this.apiSecureSender('post', params, '/api/market/balances');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param amount - float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param type - string Order type: limit or market (for market order, please specify rat as 0)
         * @param client_id - string your id for reference ( no required )
         * @returns
         */
        async placeBid(symbol, amount, rate, type, client_id) {
            const params = {
                sym: symbol,
                amt: amount,
                rat: rate,
                typ: type,
                client_id: client_id,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/v2/place-bid');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param amount -  float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param type - string Order type: limit or market (for market order, please specify rat as 0)
         * @param strid -  string your id for reference ( no required )
         * @returns
         */
        async placeBidTest(symbol, amount, rate, type, strid) {
            const params = {
                sym: symbol,
                amt: amount,
                rat: rate,
                typ: type,
                client_id: strid,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/place-bid/test');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param amount - float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
         * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param type - string Order type: limit or market (for market order, please specify rat as 0)
         * @param client_id - string your id for reference ( no required )
         * @returns
         */
        async placeAsk(symbol, amount, rate, type, client_id) {
            const params = {
                sym: symbol,
                amt: amount,
                rat: rate,
                typ: type,
                client_id: client_id,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/v2/place-ask');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param amount - float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
         * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param type - string Order type: limit or market (for market order, please specify rat as 0)
         * @param strid - string your id for reference ( no required )
         * @returns
         */
        async placeAskTest(symbol, amount, rate, type, strid) {
            const params = {
                sym: symbol,
                amt: amount,
                rat: rate,
                typ: type,
                client_id: strid,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/place-ask/test');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param amount -  float Fiat amount you want to receive with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
         * @param type - string Order type: limit or market
         * @returns
         */
        async placeAskbyFiat(symbol, amount, rate, type) {
            const params = {
                sym: symbol,
                amt: amount,
                rat: rate,
                typ: type,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/place-ask-by-fiat');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param idorder - int Order id you wish to cancel
         * @param side - string Order side: buy or sell
         * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
         * @returns
         */
        async cancelOrder(symbol, idorder, side, hash) {
            const params = {
                sym: symbol,
                id: idorder,
                sd: side,
                hash: hash,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/v2/cancel-order');
            if (data.errordata)
                return { error: data };
            if (data.error !== 0)
                return { error: this.geterrorDescription(data.error) };
            return { msg: 'success' }; // to json
        }
        /**
         *
         * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
         * @returns
         */
        async cancelOrderHash(hash) {
            const params = {
                hash: hash,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/v2/cancel-order');
            if (data.errordata)
                return { error: data };
            if (data.error !== 0)
                return { error: this.geterrorDescription(data.error) };
            return { msg: 'success' }; // to json
        }
        async myOpenOrders(symbol) {
            const params = {
                sym: symbol,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/my-open-orders');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param page - int Page (optional)
         * @param limit - int limit (optional)
         * @param start - int Start  timestamp (optional)
         * @param end - int End timestamp (optional)
         * @returns
         */
        async myOrderHistory(symbol, page, limit, start, end) {
            const params = {
                sym: symbol,
                p: page,
                lmt: limit,
                start: start,
                end: end,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/my-order-history');
            return this.checkData(data);
        }
        /**
         *
         * @param symbol - string The symbol
         * @param ids -  int Order id
         * @param orderside - string Order side: buy or sell
         * @param hashorder - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
         * @returns
         */
        async orderInfo(symbol, ids, orderside, hashorder) {
            const params = {
                sym: symbol,
                id: ids,
                sd: orderside,
                hash: hashorder,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/order-info');
            return this.checkData(data);
        }
        /**
         *
         * @param hash - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
         * @returns
         */
        async orderInfoHash(hash) {
            const params = {
                hash: hash,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/order-info');
            return this.checkData(data);
        }
        async cryptoAddresses(page, limit) {
            const params = {
                p: page,
                lmt: limit,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/crypto/addresses');
            return this.checkData(data);
        }
        /**
         *
         * @param cur - string Currency for withdrawal (e.g. BTC, ETH)
         * @param amt - float Amount you want to withdraw
         * @param adr - string Address to which you want to withdraw
         * @param mem - string (Optional) Memo or destination tag to which you want to withdraw
         * @returns
         */
        async cryptoWithdraw(cur, amt, adr, mem) {
            const params = {
                cur: cur,
                amt: amt,
                adr: adr,
                mem: mem,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/crypto/withdraw');
            return this.checkData(data);
        }
        /**
         *
         * @param cur - string Currency for withdrawal (e.g. BTC, ETH)
         * @param amt - float Amount you want to withdraw
         * @param adr - string Address to which you want to withdraw
         * @param mem - string (Optional) Memo or destination tag to which you want to withdraw
         * @returns
         */
        async cryptoInternalWithdraw(cur, amt, adr, mem) {
            const params = {
                cur: cur,
                amt: amt,
                adr: adr,
                mem: mem,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/crypto/internal-withdraw');
            return this.checkData(data);
        }
        async cryptoDepositHistory(page, limit) {
            const params = {
                p: page,
                lmt: limit,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/crypto/deposit-history');
            return this.checkData(data);
        }
        async cryptoWithdrawHistory(page, limit) {
            const params = {
                p: page,
                lmt: limit,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/crypto/withdraw-history');
            return this.checkData(data);
        }
        async cryptoGenerateAddress(symbol) {
            const params = {
                sym: symbol,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/crypto/generate-address');
            return this.checkData(data);
        }
        async fiatAccounts(page, limit) {
            const params = {
                p: page,
                lmt: limit,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/fiat/accounts');
            return this.checkData(data);
        }
        async fiatWithdraw(idbank, amount) {
            const params = {
                id: idbank,
                amt: amount,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/fiat/withdraw');
            return this.checkData(data);
        }
        async fiatDepositHistory(page, limit) {
            const params = {
                p: page,
                lmt: limit,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/fiat/deposit-history');
            return this.checkData(data);
        }
        async fiatWithdrawHistory(page, limit) {
            const params = {
                p: page,
                lmt: limit,
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/fiat/withdraw-history');
            return this.checkData(data);
        }
        async wstoken() {
            const params = {
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/market/wstoken');
            return this.checkData(data);
        }
        async userLimits() {
            const params = {
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/user/limits');
            return this.checkData(data);
        }
        async userTradingCredits() {
            const params = {
                ts: Date.now(),
            };
            const data = await this.apiSecureSender('post', params, '/api/user/trading-credits');
            return this.checkData(data);
        }
        checkData(_data) {
            if (_data.errordata)
                _data = { error: _data };
            else if (_data.error !== 0)
                _data = { error: this.geterrorDescription(_data.error) };
            return _data;
        }
        geterrorDescription(errcode) {
            switch (errcode) {
                case 0:
                    return 'No error';
                case 1:
                    return 'Invalid JSON payload';
                case 2:
                    return 'Missing X-BTK-APIKEY';
                case 3:
                    return 'Invalid API key';
                case 4:
                    return 'API pending for activation';
                case 5:
                    return 'IP not allowed';
                case 6:
                    return 'Missing / invalid signature';
                case 7:
                    return 'Missing timestamp';
                case 8:
                    return 'Invalid timestamp';
                case 9:
                    return 'Invalid user';
                case 10:
                    return 'Invalid parameter';
                case 11:
                    return 'Invalid symbol';
                case 12:
                    return 'Invalid amount';
                case 13:
                    return 'Invalid rate';
                case 14:
                    return 'Improper rate';
                case 15:
                    return 'Amount too low';
                case 16:
                    return 'Failed to get balance';
                case 17:
                    return 'Wallet is empty';
                case 18:
                    return 'Insufficient balance';
                case 19:
                    return 'Failed to insert order into db';
                case 20:
                    return 'Failed to deduct balance';
                case 21:
                    return 'Invalid order for cancellation';
                case 22:
                    return 'Invalid side';
                case 23:
                    return 'Failed to update order status';
                case 24:
                    return 'Invalid order for lookup';
                case 25:
                    return 'KYC level 1 is required to proceed';
                case 30:
                    return 'Limit exceeds';
                case 40:
                    return 'Pending withdrawal exists';
                case 41:
                    return 'Invalid currency for withdrawal';
                case 42:
                    return 'Address is not in whitelist';
                case 43:
                    return 'Failed to deduct crypto';
                case 44:
                    return 'Failed to create withdrawal record';
                case 45:
                    return 'Nonce has to be numeric';
                case 46:
                    return 'Invalid nonce';
                case 47:
                    return 'Withdrawal limit exceeds';
                case 48:
                    return 'Invalid bank account';
                case 49:
                    return 'Bank limit exceeds';
                case 50:
                    return 'Pending withdrawal exists';
                case 51:
                    return 'Withdrawal is under maintenance';
                case 52:
                    return 'Invalid permission';
                case 53:
                    return 'Invalid internal address';
                case 54:
                    return 'Address has been deprecated';
                case 90:
                    return 'Server error (please contact support)';
                default:
                    return 'Unexpect problems';
            }
        }
    }
    exports.BitkubApi = BitkubApi;
});
