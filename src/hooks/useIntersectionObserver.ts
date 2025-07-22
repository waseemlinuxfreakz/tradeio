import { useEffect, useRef, useState } from "react";

type IntersectionObserverOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};
const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [targetRef, setTargetRef] = useState<Element | null>(null);
  useEffect(() => {
    if (targetRef) {
      observerRef.current = new IntersectionObserver(callback, options);
      observerRef.current.observe(targetRef);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [targetRef, callback, options]);
  return setTargetRef;
};

export default useIntersectionObserver;
