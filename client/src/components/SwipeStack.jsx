import React, { useState, useMemo, useCallback } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useMediaQuery } from "react-responsive";
import RoomListingCard from "./RoomListingCard";

// Helper functions for animation - no rotation, cards perfectly stacked
const to = (i) => ({ x: 0, y: i * -2, scale: 1, rot: 0 });
const from = () => ({ x: 0, rot: 0, scale: 1, y: 0 });

function SwipeStack({ listings, onLike, onDislike }) {
  const [gone] = useState(() => new Set());
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Create springs with immediate initial state
  const [springs, api] = useSprings(
    listings.length, 
    (i) => ({ 
      ...to(i), 
      immediate: true, // No initial animation
    }),
    [listings.length]
  );

  // Memoize the drag handler for better performance
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], velocity: [vx], first, last }) => {
      if (!isMobile) return;

      // Swipe threshold - either fast velocity OR sufficient distance
      const swipeThreshold = 80; // Slightly reduced for better UX
      const velocityThreshold = 0.15; // Slightly reduced for better responsiveness
      
      // Only trigger on release with sufficient movement
      const trigger = last && (Math.abs(mx) > swipeThreshold || Math.abs(vx) > velocityThreshold);
      
      // Direction based on movement, with minimum threshold to avoid false triggers
      let dir = 0;
      if (Math.abs(mx) > 5) {
        dir = mx < 0 ? -1 : 1; // -1 left (dislike), 1 right (like)
      }

      // If triggered, mark as gone
      if (trigger && dir !== 0) {
        gone.add(index);
        
        // Call like/dislike callback
        const swipedItem = listings[index];
        if (dir === 1) {
          onLike?.(swipedItem);
        } else {
          onDislike?.(swipedItem);
        }
      }

      // Only animate the active card
      api.start((i) => {
        if (i !== index) return;
        
        const isGone = gone.has(index);
        
        // Calculate x position
        let x;
        if (isGone) {
          x = dir * window.innerWidth * 1.5;
        } else if (down) {
          x = mx;
        } else {
          x = 0;
        }
        
        // Reduced rotation sensitivity for smoother performance
        const rot = down ? mx / 150 : isGone ? dir * 8 * Math.abs(vx) : 0;
        const scale = down ? 1.02 : 1; // Reduced scale change

        return {
          x,
          rot,
          scale,
          immediate: down && !isGone, // Immediate updates while dragging for responsiveness
          config: { 
            friction: 60, 
            tension: down ? 400 : isGone ? 180 : 350 
          },
        };
      });
    },
    {
      // Gesture configuration for better performance
      axis: 'x', // Only respond to horizontal gestures
      threshold: 3, // Minimum movement to start gesture
      rubberband: 0.1, // Reduce rubber band effect
      filterTaps: true, // Filter out taps
    }
  );

  // Memoize container style to prevent recreations
  const containerStyle = useMemo(() => ({
    position: "relative",
    width: "100%",
    maxWidth: "350px",
    height: "500px",
    margin: "0 auto"
  }), []);

  // Memoize card styles
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
          key={`card-${i}`} // Better key for React optimization
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