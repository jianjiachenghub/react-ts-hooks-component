import { useEffect, useMemo, useState } from "react";

export type TDate = Date | number | string | undefined;
interface optionsType {
  targetDate?: TDate;
  interval?: number;
}

export interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const calcLeft = (t?: TDate) => {
  if (!t) {
    return 0;
  }
  // 如果传入到期时间 计算相差的时间戳
  const left = new Date(t).getTime() - new Date().getTime();
  // 已经到期

  if (left < 0) {
    return 0;
  }
  return left;
};

const parseMs = (milliseconds: number) :FormattedRes => {
  return {
    // 前面都加了Math.floor 比如90分钟是1.5小时，那个0.5小时舍弃是因为后面会用30分钟来描述，是逐一分解的
    days: Math.floor(milliseconds / 86400000), // 86400000毫秒是一天，以天为单位，向下取整后舍弃的是多余的时分秒，留下的是整数天（这里不需要用余数做计算）
    hours: Math.floor(milliseconds / 3600000) % 24, // 以小时为单位取24的余先排除整数天，余数就是单独剩下的小时
    minutes: Math.floor(milliseconds / 60000) % 60, // 以分为单位，取60的余就把整数小时给排除了
    seconds: Math.floor(milliseconds / 1000) % 60, 
    milliseconds: Math.floor(milliseconds) % 1000,
  }
}

export default function useCountDown(options: optionsType) {
  const { targetDate, interval = 1000 } = options || {};
  const [target, setTargetDate] = useState<TDate>(targetDate);
  const [timeLeft, setTimeLeft] = useState(() => calcLeft(target));

  useEffect(() => {
    // 每隔interval后重新计算
    const timer = setInterval(()=>{
      const  targetLeft = calcLeft(target)
      setTimeLeft(targetLeft)
    },interval)
    return ()=> clearInterval(timer)
  },[target, interval]);
  const formattedRes = useMemo(() => {
    return parseMs(timeLeft);
  },[timeLeft])
  return [timeLeft, setTargetDate, formattedRes]
}
