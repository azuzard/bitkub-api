class GridTrade {
    public griddata
    public priceDifferent
    constructor(public lowerLimit: number, public upperLimit: number, public gridNumber: number, public gridBath: number) {
        this.priceDifferent = (upperLimit - lowerLimit) / gridNumber
        let grid = [...new Array(gridNumber + 1)].map((e, i) => ({
            gridLevel: i,
            buy: false,
            price: lowerLimit + this.priceDifferent * i,
            coin: gridBath / (lowerLimit + this.priceDifferent * i),
            gridBath: gridBath,
            bitkub: "aaa",
        }))

        // for (let i = 0; i <= gridNumber; i++) {
        //     grid[i] = {
        //         gridLevel: i,
        //         buy: false,
        //         price: lowerLimit + this.priceDiff * i,
        //         coin: gridBath / (lowerLimit + this.priceDiff * i),
        //         gridBath: gridBath,
        //         bitkub: "aaa",
        //     }
        // }
        this.griddata = grid
    }
}

const gridTrade = new GridTrade(40, 80, 20, 100)
console.log(gridTrade.griddata)
// console.log(JSON.stringify(gridTrade))

// let grid = [...new Array(20)].map((e, i) => ({ gridLevel: i }))
// grid.map((e) => {
//     (e = { gridLevel: 10 })
// })

// let grid = [...new Array(10)].map(() => 42)
// console.log(grid)

// const array1 = [0, 1, 4, 9, 16]

// // pass a function to map
// const map1 = array1.map((x) => x * 2)

// console.log(map1)
// // expected output: Array [2, 8, 18, 32]
