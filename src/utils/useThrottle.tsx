import React, { useEffect } from "react";

export const useThrottle = <T extends any[]>(
  fn: (...args: T) => any,
  delay: number,
  options?: {
    immediately: boolean; // 是否立即执行一次
  }
) => {
  const { immediately = false } = options || {};
  const fnRef = React.useRef<(...args: any[]) => any>(fn);
  const preTime = React.useRef<number>(+new Date());
  const curArgs = React.useRef<any[]>([]);
  const timer = React.useRef<number>(0);

  const run = React.useCallback(
    (...args: any[]) => {
      curArgs.current = args;
      if (immediately) {
        fnRef.current(...curArgs.current);
      }
      const now = +new Date();
      if (+preTime.current + delay > now) {
        clearTimeout(timer.current);
        timer.current = window.setTimeout(
          () => {
            fnRef.current(...curArgs.current)
          },
          delay
        );
      } else {
        fnRef.current(...curArgs.current);
        preTime.current = now;
      }
    },
    [immediately, delay]
  );

  return {
    run
  };
};
