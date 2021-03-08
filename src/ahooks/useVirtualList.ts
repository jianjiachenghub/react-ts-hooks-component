import {useEffect, useState, useMemo, useRef, MutableRefObject} from 'react';
// import useSize from './useSize';


export interface OptionType {
  itemHeight: number | ((index: number) => number);
  overscan?: number;
}

/** 
 * 虚拟滚动 
 * - UI
 *  - 需要一个container 和一个  wrapper
 *  - container高固定，wrapper 很高，把container撑出滚动条
 *  - 监听container的scroll事件，先禁止默认行为
 *  - 然后每次calculateRange重新计算开始的行和结束的行，并渲染页面
 *  - 最后滚动每次计算scrollTop后，用marginTop来抵消，达到一致显示我们数据区域的目的
 * - 虚拟逻辑
 *  - 上下缓存区加中间view区
 *  - 开始向下滚动，滚动一个缓冲区高度时，scrollTop和缓存区高度相等，视图不需要做任何修改即可显示
 *  - 但如果还要往下滑，因为wrapper是一个很长的头重脚轻的列表，即头部有实体list，后面全是空白，只有高度，这样导致空白上移，迟早会显示空白到view区
 *  - 这时只需要在超过缓存区高度时，用marginTop把上移的list往下挤，然后减小与滑动距离等值的高度使得下面的空白部分收缩
 *  - 这样就保证了view区的刚好一直落到两个缓冲区的正中间，也就是我们要真正展示数据的那个区域。
 *  - 这时我们每往下滚动一个格，根据scrollTop计算start和end更新变大，可视范围因为一直保持在数据区域的正中，那么内容就是往下的变大的。
 * - 总结
 *  - 就是使用marginTop变大和hight的变小，来让view区域即使再被滚动也一直处于数据范围的正中间（往下滚动，wrapper数据区域被往上移，然后用滚动高度的margin来把它挤下来，并且数据还在不但更新，正中的数据刚好就是计算出来的下面的数据）
*/
export default <T = any>(list: T[], options: OptionType) => {
  const containerRef = useRef<HTMLElement | null>();
  const size = {};
  const [state, setSate] = useState({start: 0, end: 10});
  const {itemHeight, overscan = 5} = options;
  if( !itemHeight){
    console.error('please enter a valid itemHeight')
  }
  const getOffset = (scrollTop: number) => {
    if(typeof itemHeight === 'number'){
      // 刚好显示完就从下一个开始 有小数代表只能显示一部分了 也是从这个显示不完全的作为第一个
      return Math.floor(scrollTop / itemHeight) + 1
    }
    let sum = 0;
    let offset = 0;
    for(let i=0; i< list.length; i++){
      const height = itemHeight(i);
      sum += height;
      if(sum > scrollTop) {
        offset = i;
        break;
      }
    }
    return offset + 1;
  }

  const getViewCapacity = (containerHeight: number) => {
    if (typeof itemHeight === 'number') {
      // 往上取整 最后一个显示不完也算是最后一个
      return Math.ceil(containerHeight / itemHeight);
    }
    const { start = 0 } = state;
    let sum = 0;
    let capacity = 0;
    for (let i = start; i < list.length; i++) {
      const height = (itemHeight as (index: number) => number)(i);
      sum += height;
      if (sum >= containerHeight) {
        capacity = i;
        break;
      }
    }
    return capacity - start;
  }

  const calculateRange = () => {
    const element = containerRef.current;
    if(element) {
      const offset = getOffset(element.scrollTop);
      const viewCapacity = getViewCapacity(element.clientHeight);

      const from = offset - overscan;// 这里等于0表示刚好滑到中间，即上下缓存区刚好相等，如果再滑就需要用marginTop来往下挤
      const to = offset + viewCapacity + overscan;
      setSate({
        start: from < 0 ? 0 : from, // 
        end: to > list.length ? list.length : to
      })
    }
  }
  console.log(state.start,state.end)

  // 计算第i个item到顶端的距离, 然后就可以指定跳转
  const getDistanceTop = (index: number) => {
    if (typeof itemHeight === 'number') {
      const height = index * itemHeight;
      return height;
    }
    const height = list.slice(0, index).reduce((sum, _, i) => sum + itemHeight(i), 0);
    return height;
  }

  const scrollTo = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = getDistanceTop(index);
      calculateRange();
    }
  }

  useEffect(() => {
    calculateRange();
  }, []);

  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return list.length * itemHeight;
    }
    return list.reduce((sum, _, index) => sum + itemHeight(index), 0);
  }, [list.length]);

  // 计算当前的滑动距离 显示的时候wrapper可以舍弃到滑动的部分高度，用margin来填充
  const offsetTop = useMemo(() => getDistanceTop(state.start), [state.start]);


  return {
    list: list.slice(state.start, state.end).map((ele, index) => ({
      data: ele,
      index: index + state.start
    })),
    scrollTo,
    containerProps: {
      ref: (ele:any) => {
        containerRef.current = ele;
      },
      onScroll: (e: any) => {
        e.preventDefault();
        calculateRange();
      },
      style: { overflowY: 'auto' as const },
    },
    wrapperProps: {
      style: {
        width: '100%',
        height: totalHeight-offsetTop, // 当把最开始的滑动完后，scrollTop大了就会看到后面出现空白，这时需要缩减后面的高度，用margin填补前面，把有画面的区域挤到下面来
        marginTop: offsetTop,// 用margin来填补，保证element.scrollTop滑动到后面时，也可以看到list
      },
    },
  }
}