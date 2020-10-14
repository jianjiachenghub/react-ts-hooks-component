/* 
const useRaf=initialState=>{
    const frame=useRef(0);
    const [state,setState]=useState(initialState);
    const setRaf=useCallback(value=>{
      // 使用 requestAnimationFrame 来节流。 普通节流是设定一个delay事件 这里相当于等一帧的数据来节流一次
      cancelAnimationFrame(frame.current);
      frame.current=requestAnimationFrame(()=>{
        setState(value);
      });
    },[]);
    useEffect(()=>{
      return ()=>cancelAnimationFrame(frame.current);
    },[]);
    return [state,setRaf];
  };

  const useViewSize=()=> {
    const [state,setRaf]=useRaf(getViewportSize());
    useEffect(()=>{
      const handler=()=>setRaf(getViewportSize());
      window.addEventListener('resize',handler,false);
      return ()=>{
        window.removeEventListener('resize',handler,false);
      };
    },[]);
    return state;
  };

  const {width,height}=useViewSize(); */
  //https://zhuanlan.zhihu.com/p/111636726



export default {};
