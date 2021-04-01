// 约定参数 url 可以是一个函数并且该函数返回一个字符串作为请求的唯一标识符；
// 当调用该函数抛出异常时就意味着它的依赖还没有就绪，将暂停这个请求；
// 在依赖的请求完成时，通过 setState 触发重新渲染，此时 url 会被更新，同时通过 useEffect 监听 url 是否有改变触发新一轮的请求。
/* const Home = () => {
  // A 和 B 两个并行请求，且 B 依赖 A 请求
  const { data: a } = useFetch('/api/a')
  const { data: b } = useFetch(() => `/api/b?id=${a.id}`)

  return 
}

const useFetch = (url, fetcher, options) => {
  
  const getKeyArgs = _key => {
    let key
    if (typeof _key === 'function') {
      // 核心所在:
      // 当 url 抛出异常时意味着它的依赖还没有就绪则暂停请求
      // 也就是将 key 设置为空字符串
      try {
        key = _key()
      } catch (err) {
        key = ''
      }
    } else {
      // convert null to ''
      key = String(_key || '')
    }
    return key
  }

  useEffect(() => {
    const [data, setData] = useState(undefined)
    const key = getKeyArgs(url)
    const fetchData = async () => {
      try {
        const newData = await fn(key);
        setData(newData)
      } catch(error) {
        // 
      }
    }

    fetchData()
    
  // 核心所在
  // 当 A 请求完成时通过 setData 触发 UI 重新渲染
  // 继而当 url 更新时触发 B 的新一轮请求
  }, [key])

  return {}
} */