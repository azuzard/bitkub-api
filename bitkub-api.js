"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitkubApi = void 0;
var axios_1 = require("axios");
var crypto_1 = require("crypto"); // just used one time.
// TODO How to use.
// import { BitkubApi } from "./BitkubApi"
// const bitkubApi = new BitkubApi()
// const res = async () => console.log(await bitkubApi.ticker("THB_XLM"))
// const res = async () => console.log(await bitkubApi.placeBid("THB_XLM", 1000000, 10, "limit"))
// res()
var BitkubApi = /** @class */ (function () {
    function BitkubApi(key, secret) {
        var _a, _b, _c;
        this.BITKUB_ROOT_URL = (_a = process.env.BITKUB_ROOT_URL) !== null && _a !== void 0 ? _a : 'https://api.bitkub.com'; // to Public the constant.
        this.key = (_b = key !== null && key !== void 0 ? key : process.env.API_KEY_KUB) !== null && _b !== void 0 ? _b : 'nokey';
        this.secret = (_c = secret !== null && secret !== void 0 ? secret : process.env.API_SECRET_KUB) !== null && _c !== void 0 ? _c : 'nokey';
    }
    BitkubApi.prototype.apiSecureSender = function (req, params, urlapi) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.checknokey();
                        params.sig = (0, crypto_1.createHmac)('sha256', this.secret).update(JSON.stringify(params)).digest('hex');
                        return [4 /*yield*/, (0, axios_1.default)({
                                method: req,
                                url: this.BITKUB_ROOT_URL + urlapi,
                                headers: {
                                    Accept: 'application/json',
                                    'Content-type': 'application/json',
                                    'X-BTK-APIKEY': this.key,
                                },
                                data: params,
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, { errordata: error_1 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BitkubApi.prototype.apiSender = function (req, params, urlapi) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, axios_1.default)({
                                method: req,
                                url: this.BITKUB_ROOT_URL + urlapi,
                                params: params,
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, { errordata: error_2 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BitkubApi.prototype.checknokey = function () {
        if (this.key == 'nokey' || this.secret == 'nokey')
            throw 'key not found';
    };
    //////////////////////////////////////////////////////////////////////////////////////////
    BitkubApi.prototype.status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        return [4 /*yield*/, this.apiSender('get', params, '/api/status')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }]; // unknown error
                        return [2 /*return*/, data];
                }
            });
        });
    };
    BitkubApi.prototype.servertime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        return [4 /*yield*/, this.apiSender('get', params, '/api/servertime')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }];
                        return [2 /*return*/, { time: data }]; // json it.
                }
            });
        });
    };
    BitkubApi.prototype.symbols = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {};
                        return [4 /*yield*/, this.apiSender('get', params, '/api//market/symbols')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }]; // unknown error
                        if (data.error !== 0)
                            return [2 /*return*/, { error: this.geterrorDescription(data.error) }]; // bitkub error
                        return [2 /*return*/, data];
                }
            });
        });
    };
    BitkubApi.prototype.ticker = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol, // string The symbol (optional)
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/api/market/ticker')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    BitkubApi.prototype.trades = function (symbol, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            lmt: limit, //  int No. of limit to query recent trades
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/api/market/trades')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.bids = function (symbol, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            lmt: limit, //  int No. of limit to query open buy orders
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/api/market/bids')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.asks = function (symbol, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            lmt: limit, //  int No. of limit to query open sell orders
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/api/market/asks')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.books = function (symbol, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            lmt: limit, //  int No. of limit to query open orders
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/api/market/books')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol (e.g. BTC_THB) !!!! BTC_THB it not th same other api
     * @param resolution - string Chart resolution (1, 5, 15, 60, 240, 1D)
     * @param from -  int Timestamp of the starting time (e.g. 1633424427)
     * @param to - int Timestamp of the starting time (e.g. 1633424427)
     * @returns
     */
    BitkubApi.prototype.tradingviewHistory = function (symbol, resolution, from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            symbol: symbol,
                            resolution: resolution,
                            from: from,
                            to: to,
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/tradingview/history')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    BitkubApi.prototype.depth = function (symbol, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            lmt: limit, //  int Depth size
                        };
                        return [4 /*yield*/, this.apiSender('get', params, '/api/market/depth')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //////////////////////////////////////////////////////////////////////////////////////////
    BitkubApi.prototype.wallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { ts: Date.now() };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/wallet')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.balances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { ts: Date.now() };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/balances')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param amount - float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param client_id - string your id for reference ( no required )
     * @returns
     */
    BitkubApi.prototype.placeBid = function (symbol, amount, rate, type, client_id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            amt: amount,
                            rat: rate,
                            typ: type,
                            client_id: client_id,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/v2/place-bid')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param amount -  float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param strid -  string your id for reference ( no required )
     * @returns
     */
    BitkubApi.prototype.placeBidTest = function (symbol, amount, rate, type, strid) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            amt: amount,
                            rat: rate,
                            typ: type,
                            client_id: strid,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/place-bid/test')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param amount - float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param client_id - string your id for reference ( no required )
     * @returns
     */
    BitkubApi.prototype.placeAsk = function (symbol, amount, rate, type, client_id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            amt: amount,
                            rat: rate,
                            typ: type,
                            client_id: client_id,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/v2/place-ask')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param amount - float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param strid - string your id for reference ( no required )
     * @returns
     */
    BitkubApi.prototype.placeAskTest = function (symbol, amount, rate, type, strid) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            amt: amount,
                            rat: rate,
                            typ: type,
                            client_id: strid,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/place-ask/test')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param amount -  float Fiat amount you want to receive with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market
     * @returns
     */
    BitkubApi.prototype.placeAskbyFiat = function (symbol, amount, rate, type) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            amt: amount,
                            rat: rate,
                            typ: type,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/place-ask-by-fiat')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param idorder - int Order id you wish to cancel
     * @param side - string Order side: buy or sell
     * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
     * @returns
     */
    BitkubApi.prototype.cancelOrder = function (symbol, idorder, side, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            id: idorder,
                            sd: side,
                            hash: hash,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/v2/cancel-order')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }];
                        if (data.error !== 0)
                            return [2 /*return*/, { error: this.geterrorDescription(data.error) }];
                        return [2 /*return*/, { msg: 'success' }]; // to json
                }
            });
        });
    };
    /**
     *
     * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
     * @returns
     */
    BitkubApi.prototype.cancelOrderHash = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            hash: hash,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/v2/cancel-order')];
                    case 1:
                        data = _a.sent();
                        if (data.errordata)
                            return [2 /*return*/, { error: data }];
                        if (data.error !== 0)
                            return [2 /*return*/, { error: this.geterrorDescription(data.error) }];
                        return [2 /*return*/, { msg: 'success' }]; // to json
                }
            });
        });
    };
    BitkubApi.prototype.myOpenOrders = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/my-open-orders')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param page - int Page (optional)
     * @param limit - int limit (optional)
     * @param start - int Start  timestamp (optional)
     * @param end - int End timestamp (optional)
     * @returns
     */
    BitkubApi.prototype.myOrderHistory = function (symbol, page, limit, start, end) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            p: page,
                            lmt: limit,
                            start: start,
                            end: end,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/my-order-history')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param symbol - string The symbol
     * @param ids -  int Order id
     * @param orderside - string Order side: buy or sell
     * @param hashorder - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
     * @returns
     */
    BitkubApi.prototype.orderInfo = function (symbol, ids, orderside, hashorder) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            id: ids,
                            sd: orderside,
                            hash: hashorder,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/order-info')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param hash - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
     * @returns
     */
    BitkubApi.prototype.orderInfoHash = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            hash: hash,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/order-info')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.cryptoAddresses = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            p: page,
                            lmt: limit,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/crypto/addresses')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param cur - string Currency for withdrawal (e.g. BTC, ETH)
     * @param amt - float Amount you want to withdraw
     * @param adr - string Address to which you want to withdraw
     * @param mem - string (Optional) Memo or destination tag to which you want to withdraw
     * @returns
     */
    BitkubApi.prototype.cryptoWithdraw = function (cur, amt, adr, mem) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            cur: cur,
                            amt: amt,
                            adr: adr,
                            mem: mem,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/crypto/withdraw')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    /**
     *
     * @param cur - string Currency for withdrawal (e.g. BTC, ETH)
     * @param amt - float Amount you want to withdraw
     * @param adr - string Address to which you want to withdraw
     * @param mem - string (Optional) Memo or destination tag to which you want to withdraw
     * @returns
     */
    BitkubApi.prototype.cryptoInternalWithdraw = function (cur, amt, adr, mem) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            cur: cur,
                            amt: amt,
                            adr: adr,
                            mem: mem,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/crypto/internal-withdraw')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.cryptoDepositHistory = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            p: page,
                            lmt: limit,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/crypto/deposit-history')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.cryptoWithdrawHistory = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            p: page,
                            lmt: limit,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/crypto/withdraw-history')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.cryptoGenerateAddress = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            sym: symbol,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/crypto/generate-address')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.fiatAccounts = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            p: page,
                            lmt: limit,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/fiat/accounts')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.fiatWithdraw = function (idbank, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            id: idbank,
                            amt: amount,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/fiat/withdraw')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.fiatDepositHistory = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            p: page,
                            lmt: limit,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/fiat/deposit-history')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.fiatWithdrawHistory = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            p: page,
                            lmt: limit,
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/fiat/withdraw-history')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.wstoken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/market/wstoken')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.userLimits = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/user/limits')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.userTradingCredits = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            ts: Date.now(),
                        };
                        return [4 /*yield*/, this.apiSecureSender('post', params, '/api/user/trading-credits')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.checkData(data)];
                }
            });
        });
    };
    BitkubApi.prototype.checkData = function (_data) {
        if (_data.errordata)
            _data = { error: _data };
        else if (_data.error !== 0)
            _data = { error: this.geterrorDescription(_data.error) };
        return _data;
    };
    BitkubApi.prototype.geterrorDescription = function (errcode) {
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
    };
    return BitkubApi;
}());
exports.BitkubApi = BitkubApi;
