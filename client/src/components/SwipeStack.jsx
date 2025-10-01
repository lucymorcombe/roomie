import React, { useState, useMemo, useEffect } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useMediaQuery } from "react-responsive";
import RoomListingCard from "./RoomListingCard";

const to = (i) => ({ x: 0, y: i * -2, scale: 1, rot: 0 });
const from = () => ({ x: 0, rot: 0, scale: 1, y: 0 });

function SwipeStack({ listings, onLike, onDislike, onIndexChange }) {
  const [gone] = useState(() => new Set());
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [springs, api] = useSprings(
    listings.length, 
    (i) => ({ 
      ...to(i), 
      immediate: true,
    }),
    [listings.length]
  );

  const currentCardIndex = useMemo(() => {
    return listings.findIndex((_, i) => !gone.has(i));
  }, [listings, gone]);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentCardIndex !== -1 ? currentCardIndex : 0);
    }
  }, [currentCardIndex, onIndexChange]);

  const bind = useDrag(
    ({ args: [index], down, movement: [mx], velocity: [vx], first, last }) => {
      if (!isMobile) return;

      const swipeThreshold = 80; 
      const velocityThreshold = 0.15; 
      
      const trigger = last && (Math.abs(mx) > swipeThreshold || Math.abs(vx) > velocityThreshold);
      
      let dir = 0;
      if (Math.abs(mx) > 5) {
        dir = mx < 0 ? -1 : 1; 
      }

      if (trigger && dir !== 0) {
        gone.add(index);
        
        const swipedItem = listings[index];
        if (dir === 1) {
          onLike?.(swipedItem);
        } else {
          onDislike?.(swipedItem);
        }
      }

      api.start((i) => {
        if (i !== index) return;
        
        const isGone = gone.has(index);
        
        let x;
        if (isGone) {
          x = dir * window.innerWidth * 1.5;
        } else if (down) {
          x = mx;
        } else {
          x = 0;
        }
        
        const rot = down ? mx / 150 : isGone ? dir * 8 * Math.abs(vx) : 0;
        const scale = down ? 1.02 : 1;

        return {
          x,
          rot,
          scale,
          immediate: down && !isGone, 
          config: { 
            friction: 60, 
            tension: down ? 400 : isGone ? 180 : 350 
          },
        };
      });
    },
    {
      axis: 'x', 
      threshold: 3, 
      rubberband: 0.1, 
      filterTaps: true, 
    }
  );

  const containerStyle = useMemo(() => ({
    position: "relative",
    width: "95%",
    minHeight: "420px",
    margin: "0 auto"
  }), []);

  const cardOuterStyle = useMemo(() => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    willChange: "transform",
  }), []);

  const cardInnerStyle = useMemo(() => ({
    width: "100%",
    height: "100%",
    touchAction: isMobile ? "pan-y" : "auto",
    userSelect: "none",
    cursor: "default",
  }), [isMobile]);

  return (
    <div style={containerStyle}>
      {springs.map(({ x, y, rot, scale }, i) => (
        <animated.div
          key={`card-${i}`} 
          style={{
            ...cardOuterStyle,
            transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          }}
        >
          <animated.div
            {...(isMobile ? bind(i) : {})}
            style={{
              ...cardInnerStyle,
              transform: interpolate([rot, scale], (r, s) => `rotate(${r}deg) scale(${s})`),
            }}
          >
            <RoomListingCard {...listings[i]} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
}

export default SwipeStack;