import { useEffect, useState } from "react"

var receivedData: any = null

type Listener = (state: boolean, data: any) => void
export type Fetcher = () => Promise<any>
type TopFetch = [
    loadingStatus: boolean,
    data: any,
]
type AddListener = (cb: Listener) => number
type RemoveListener = (id: number) => void
interface ReturnFromTopFetch {
    addListener: AddListener,
    removeListener: RemoveListener
}
type StartTopFetch = (fetcher: Fetcher) => ReturnFromTopFetch

export const startTopFetch = function (fetcher: Fetcher) {
    if (typeof window === 'undefined') {
        return null
    }
    let receivedData: any = null
    let listener: Listener[] = []
    function addListener(cb: Listener): number {
        if (receivedData) {
            cb(false, receivedData)
            return 0
        }
        else {
            listener.push(cb)
            console.log("listenre:", listener)
            return listener.length - 1
        }
    }
    //Remove Listener, prevent useEffect be called multitimes
    function removeListener(id: number) {

        if (id && id >= 0 && id < listener.length) {
            listener.splice(id, 1)
        }
    }

    let res = fetcher()
    if (typeof res.then === "undefined") {
        console.log("The function must be return a promise and pass data you wanted when promise is fullfilled")
        listener.forEach((cb) => cb(false, null))
    }
    else
        res.then(
            (data: any) => {
                receivedData = data
                listener.forEach((cb) => cb(false, receivedData))
            })
    return { addListener, removeListener }
} as StartTopFetch

export const useTopFetch = (listener: ReturnFromTopFetch): TopFetch => {
    // if(!listener) return [false,null]
    const [loadingStatus, setLoadingStatus] = useState(true)
    useEffect(() => {
        if (!listener) return
        const id = listener.addListener((v: boolean, data: any) => {
            setLoadingStatus(v)
            receivedData = data
        })
        console.log("add listener")
        return () => listener.removeListener(id)
    }, [listener])
    return [loadingStatus, receivedData]

}
