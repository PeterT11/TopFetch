# TopFetch
Fetch  data from server as soon as when page script start and before rendering 

## Usage
1. import file in your component:
```
import { startTopFetch, useTopFetch } from "./topFetch";
```

2. call startTopFetch before your component function and pass a callback function, callback function type: ()=>Promise<any>
```
const myTopFetch = startTopFetch(fakeFetch)
```
3. In your component, call useTopFetch and pass the return value from startTopFetch. 
```
    const [isLoading, dataFromServer] = useTopFetch(myTopFetch)
```
When fetching is finished. isLoading will be false and React will re-rendering your page automatically.
