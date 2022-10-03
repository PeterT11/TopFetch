import { startTopFetch, useTopFetch } from "./topFetch";

// a fakeFetch 
const fakeFetch = async () => {
    const p = new Promise<object>((resolve, reject) => {
        setTimeout(() => {
            resolve({ value: "Data from the server" })
        }, 1000)
    })
    // }).catch((e) => { console.log("in .catch:", e) })
    return p
}

//Usage: call startTopFetch before your component function and pass a callback function, callback function type: ()=>Promise<any>
const myTopFetch = startTopFetch(fakeFetch)

export const Demo = () => {
    const defaultData = { value: "Default Data" }
    
    //In your component , call useTopFetch and pass the return value from startTopFetch.    
    const [isloading, dataFromServer] = useTopFetch(myTopFetch)
    return <>
        {isloading ? (
        <div>{defaultData.value}</div>
        ) : (
        <div>{dataFromServer.value}</div>
        )}
    </>
}
