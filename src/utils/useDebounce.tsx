import React, { useEffect } from "react";

export const useDebounce = <T extends any[]>(
  fn: (...args: T) => any,
  delay: number,
  options?: {
    immediately: boolean; // 是否立即执行一次
  }
) => {
  const { immediately = false } = options || {};
  const fnRef = React.useRef<(...args: any[]) => any>(fn);
  const timer = React.useRef<number>(0);
  const curArgs = React.useRef<any[]>([]);

  const run = React.useCallback(
    (...args: any[]) => {
      curArgs.current = args;
      if (immediately) {
        fnRef.current(...curArgs.current);
      }
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(
        () => fnRef.current(...curArgs.current),
        delay
      );
    },
    [immediately, delay]
  );

  return {
    run
  };
};
