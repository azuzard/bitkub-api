function ticker() {
    let ticker = {
        THB_AAVE: {
            id: 75,
            last: 2146.14,
        },
        THB_ABT: {
            id: 22,
            last: 2.06,
        },
    }
    const key = Object.keys(ticker)
    const value = Object.values(ticker)
    const newticker: any[] = []
    Object.keys(ticker).forEach((element, i) => newticker.push(Object.assign({ symbol: element }, Object.values(ticker)[i])))
    console.table(newticker)
    // const { THB_ABT, THB_AAVE }: { THB_ABT: any; THB_AAVE: any } = ticker
    // console.log({ THB_ABT })
    // console.log({ THB_AAVE })
}
export { ticker }
ticker()
