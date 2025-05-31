import {useState,useEffect} from "react"
 function useFetch(url){
    const [loading,setLoading] = useState([])
    const [data,setData] = useState(false)
    const [error,setError] = useState(null)

    useEffect(()=>{
        setLoading(true)
        fetch(url)
        .then((response)=>response.json())
        .then((data)=>{setData(data)})
        .catch((error)=>{setError(error)})
        .finally(()=>{setLoading(false)})
    },[url])
    return{loading,data,error}
}
export default useFetch