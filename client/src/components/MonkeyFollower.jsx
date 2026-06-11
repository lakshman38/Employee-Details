import { useEffect, useMemo, useRef, useState } from "react";

function MonkeyFollower({ position }) {
  const elementRef = useRef(null);
  const currentRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastStampRef = useRef(performance.now());
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkLoop = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 100);
    }, 2800 + Math.random() * 2200);

    return () => window.clearInterval(blinkLoop);
  }, []);

  useEffect(() => {
    let frameId = 0;

    const animate = () => {
      const element = elementRef.current;

      if (!element) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      const nextX = currentRef.current.x + (position.x - currentRef.current.x) * 0.1;
      const nextY = currentRef.current.y + (position.y - currentRef.current.y) * 0.1;
      const now = performance.now();
      const deltaTime = Math.max(16, now - lastStampRef.current);

      velocityRef.current = {
        x: (nextX - currentRef.current.x) / deltaTime,
        y: (nextY - currentRef.current.y) / deltaTime
      };
      lastStampRef.current = now;
      currentRef.current = { x: nextX, y: nextY };

      const direction = velocityRef.current.x >= 0 ? 1 : -1;
      const speed = Math.min(1, Math.abs(velocityRef.current.x) * 150 + Math.abs(velocityRef.current.y) * 150);
      const bob = 2 + speed * 4;
      const rotate = direction * Math.min(12, speed * 14);

      element.style.setProperty("--monkey-x", `${nextX}px`);
      element.style.setProperty("--monkey-y", `${nextY}px`);
      element.style.setProperty("--monkey-rotate", `${rotate}deg`);
      element.style.setProperty("--monkey-bob", `${bob}px`);
      element.style.setProperty("--monkey-scale", `${1 + speed * 0.04}`);

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [position]);

  const classes = useMemo(() => {
    return ["monkey-follower", blink ? "blink" : ""]
      .filter(Boolean)
      .join(" ");
  }, [blink]);

  return (
    <div ref={elementRef} className={classes} aria-hidden="true">
      <div className="monkey-follower-shadow" />
      <div className="monkey-follower-body">
        <span className="monkey-follower-ear ear-left" />
        <span className="monkey-follower-ear ear-right" />
        <span className="monkey-follower-face" />
        <span className="monkey-follower-eye eye-left" />
        <span className="monkey-follower-eye eye-right" />
        <span className="monkey-follower-nose" />
        <span className="monkey-follower-whisker whisker-left" />
        <span className="monkey-follower-whisker whisker-right" />
        <span className="monkey-follower-arm arm-left" />
        <span className="monkey-follower-arm arm-right" />
        <span className="monkey-follower-tail" />
      </div>
    </div>
  );
}

export default MonkeyFollower;
