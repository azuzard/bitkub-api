export declare class BitkubApi {
    constructor(key?: string, secret?: string);
    key: string;
    secret: string;
    BITKUB_ROOT_URL: string;
    private apiSecureSender;
    private apiSender;
    private checknokey;
    status(): Promise<any>;
    servertime(): Promise<{
        error: any;
        time?: undefined;
    } | {
        time: any;
        error?: undefined;
    }>;
    symbols(): Promise<any>;
    ticker(symbol?: string): Promise<any>;
    trades(symbol: string, limit: number): Promise<any>;
    bids(symbol: string, limit: number): Promise<any>;
    asks(symbol: string, limit: number): Promise<any>;
    books(symbol: string, limit: number): Promise<any>;
    /**
     *
     * @param symbol - string The symbol (e.g. BTC_THB) !!!! BTC_THB it not th same other api
     * @param resolution - string Chart resolution (1, 5, 15, 60, 240, 1D)
     * @param from -  int Timestamp of the starting time (e.g. 1633424427)
     * @param to - int Timestamp of the starting time (e.g. 1633424427)
     * @returns
     */
    tradingviewHistory(symbol: string, resolution: string, from: number, to: number): Promise<any>;
    depth(symbol: string, limit: number): Promise<any>;
    wallet(): Promise<any>;
    balances(): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param amount - float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param client_id - string your id for reference ( no required )
     * @returns
     */
    placeBid(symbol: string, amount: number, rate: number, type: string, client_id?: string): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param amount -  float Amount you want to spend with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param strid -  string your id for reference ( no required )
     * @returns
     */
    placeBidTest(symbol: string, amount: number, rate: number, type: string, strid?: string): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param amount - float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param client_id - string your id for reference ( no required )
     * @returns
     */
    placeAsk(symbol: string, amount: number, rate: number, type: string, client_id?: string): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param amount - float Amount you want to sell with no trailing zero (e.g 0.10000000 is invalid, 0.1 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market (for market order, please specify rat as 0)
     * @param strid - string your id for reference ( no required )
     * @returns
     */
    placeAskTest(symbol: string, amount: number, rate: number, type: string, strid?: string): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param amount -  float Fiat amount you want to receive with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param rate - float Rate you want for the order with no trailing zero (e.g 1000.00 is invalid, 1000 is ok)
     * @param type - string Order type: limit or market
     * @returns
     */
    placeAskbyFiat(symbol: string, amount: number, rate: number, type: string): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param idorder - int Order id you wish to cancel
     * @param side - string Order side: buy or sell
     * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
     * @returns
     */
    cancelOrder(symbol: string, idorder: number, side: string, hash?: string): Promise<{
        error: any;
        msg?: undefined;
    } | {
        msg: string;
        error?: undefined;
    }>;
    /**
     *
     * @param hash - string Cancel an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash.
     * @returns
     */
    cancelOrderHash(hash: string): Promise<{
        error: any;
        msg?: undefined;
    } | {
        msg: string;
        error?: undefined;
    }>;
    myOpenOrders(symbol: string): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param page - int Page (optional)
     * @param limit - int limit (optional)
     * @param start - int Start  timestamp (optional)
     * @param end - int End timestamp (optional)
     * @returns
     */
    myOrderHistory(symbol: string, page?: number, limit?: number, start?: number, end?: number): Promise<any>;
    /**
     *
     * @param symbol - string The symbol
     * @param ids -  int Order id
     * @param orderside - string Order side: buy or sell
     * @param hashorder - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
     * @returns
     */
    orderInfo(symbol: string, ids: number, orderside: string, hashorder?: string): Promise<any>;
    /**
     *
     * @param hash - string Lookup an order with order hash (optional). You don't need to specify sym, id, and sd when you specify order hash
     * @returns
     */
    orderInfoHash(hash: string): Promise<any>;
    cryptoAddresses(page?: number, limit?: number): Promise<any>;
    /**
     *
     * @param cur - string Currency for withdrawal (e.g. BTC, ETH)
     * @param amt - float Amount you want to withdraw
     * @param adr - string Address to which you want to withdraw
     * @param mem - string (Optional) Memo or destination tag to which you want to withdraw
     * @returns
     */
    cryptoWithdraw(cur: string, amt: number, adr: string, mem?: string): Promise<any>;
    /**
     *
     * @param cur - string Currency for withdrawal (e.g. BTC, ETH)
     * @param amt - float Amount you want to withdraw
     * @param adr - string Address to which you want to withdraw
     * @param mem - string (Optional) Memo or destination tag to which you want to withdraw
     * @returns
     */
    cryptoInternalWithdraw(cur: string, amt: number, adr: string, mem?: string): Promise<any>;
    cryptoDepositHistory(page?: number, limit?: number): Promise<any>;
    cryptoWithdrawHistory(page?: number, limit?: number): Promise<any>;
    cryptoGenerateAddress(symbol: string): Promise<any>;
    fiatAccounts(page?: number, limit?: number): Promise<any>;
    fiatWithdraw(idbank: string, amount: number): Promise<any>;
    fiatDepositHistory(page?: number, limit?: number): Promise<any>;
    fiatWithdrawHistory(page?: number, limit?: number): Promise<any>;
    wstoken(): Promise<any>;
    userLimits(): Promise<any>;
    userTradingCredits(): Promise<any>;
    private checkData;
    private geterrorDescription;
}
