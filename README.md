# bitkub-api
API for Bitkub exchange nodejs versions. It' simple wrap, use with cautions.


## Note:  How to use.

```ts
import { BitkubApi } from "bitkub-api"
const bitkubApi = new BitkubApi()
const res = async () => console.log(await bitkubApi.ticker("THB_XLM"))
// const res = async () => console.log(await bitkubApi.placeBid("THB_XLM", 1000000, 10, "limit"))
res()
```

