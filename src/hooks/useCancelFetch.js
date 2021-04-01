import React, { useState, useEffect, useCallback } from 'react';
 
 const useFetch = (config, deps) => {
  const abortController = new AbortController() // https://developer.mozilla.org/zh-CN/docs/Web/API/FetchController
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState()

  useEffect(() => {
    setLoading(true)
    fetch({
      ...config,
      signal: abortController.signal
    })
      .then((res) => setResult(res))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => {
    return () => abortController.abort()
  }, [])

  return { result, loading }
}
