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
    if(typeof window === 'undefined') return null  //return null if run at server side. it will do nothing untill re-render at browser side
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
    function removeListener(id: number) {

        console.log("before remove listener: ", id)
        if (id && id >= 0 && id < listener.length) {
            listener.splice(id, 1)
        }
    }
    let res = fetcher()
    if (typeof res.then === "undefined") {
        receivedData = res
    }
    else {
        fetcher().then(
            (data: any) => {
                receivedData = data
            },
        ).finally(() => {
            listener.forEach((cb) => cb(false, receivedData))
        })

    }
    return { addListener, removeListener }
} as StartTopFetch

export const useTopFetch = (listener: ReturnFromTopFetch): TopFetch => {
    const [loadingStatus, setLoadingStatus] = useState(true)
    useEffect(() => {
        if(!listener) return //Null may because pre-render at server side.
        const id = listener.addListener((v: boolean, data: any) => {
            setLoadingStatus(v)
            receivedData = data
        })
        console.log("add listener")
        return () => listener.removeListener(id)
    }, [listener])
    return [loadingStatus, receivedData]

}
