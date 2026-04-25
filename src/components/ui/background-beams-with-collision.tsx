"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    // Original beams
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7 },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },

    // New beams
    {
      initialX: 200,
      translateX: 200,
      duration: 9,
      repeatDelay: 5,
      delay: 1,
      className: "h-10",
    },
    { initialX: 300, translateX: 300, duration: 6, repeatDelay: 8, delay: 3 },
    {
      initialX: 500,
      translateX: 500,
      duration: 4,
      repeatDelay: 6,
      delay: 1,
      className: "h-16",
    },
    {
      initialX: 700,
      translateX: 700,
      duration: 8,
      repeatDelay: 3,
      delay: 5,
      className: "h-8",
    },
    {
      initialX: 900,
      translateX: 900,
      duration: 5,
      repeatDelay: 9,
      delay: 2,
      className: "h-24",
    },
    {
      initialX: 1100,
      translateX: 1100,
      duration: 10,
      repeatDelay: 4,
      delay: 0,
      className: "h-6",
    },
    {
      initialX: 1300,
      translateX: 1300,
      duration: 7,
      repeatDelay: 6,
      delay: 3,
      className: "h-14",
    },
    {
      initialX: 50,
      translateX: 50,
      duration: 12,
      repeatDelay: 2,
      delay: 6,
      className: "h-10",
    },
    {
      initialX: 750,
      translateX: 750,
      duration: 3,
      repeatDelay: 11,
      delay: 1,
      className: "h-18",
    },
    {
      initialX: 1050,
      translateX: 1050,
      duration: 6,
      repeatDelay: 5,
      delay: 4,
      className: "h-8",
    },
    {
      initialX: 350,
      translateX: 350,
      duration: 9,
      repeatDelay: 3,
      delay: 7,
      className: "h-6",
    },
    {
      initialX: 650,
      translateX: 650,
      duration: 4,
      repeatDelay: 7,
      delay: 0,
      className: "h-20",
    },
    {
      initialX: 1150,
      translateX: 1150,
      duration: 8,
      repeatDelay: 10,
      delay: 2,
      className: "h-12",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "bg-background relative flex flex-col w-full justify-start overflow-hidden",
        className,
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
          parentRef={parentRef as React.RefObject<HTMLDivElement>}
        />
      ))}

      {children}

      {/* Collision target — sits at the very bottom of the wrapper */}
      <div
        ref={containerRef}
        className="absolute bottom-0 w-full inset-x-0 pointer-events-none h-px bg-transparent"
      />
    </div>
  );
};

interface BeamOptions {
  initialX?: number;
  translateX?: number;
  initialY?: number;
  translateY?: number;
  rotate?: number;
  className?: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
}

interface CollisionMechanismProps {
  containerRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
  beamOptions?: BeamOptions;
}

const CollisionMechanism = ({
  parentRef,
  containerRef,
  beamOptions = {},
}: CollisionMechanismProps) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);
  // Track the parent's total height so beams always reach the bottom
  const [parentHeight, setParentHeight] = useState(2000);

  useEffect(() => {
    if (!parentRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setParentHeight(entry.contentRect.height + 200); // +200 buffer
    });
    ro.observe(parentRef.current);
    return () => ro.disconnect();
  }, [parentRef]);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;
          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);
    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);
      setTimeout(() => setBeamKey((prev) => prev + 1), 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY ?? "-200px",
          translateX: beamOptions.initialX ?? "0px",
          rotate: beamOptions.rotate ?? 0,
        }}
        variants={{
          animate: {
            translateY: `${parentHeight}px`, // dynamic — always reaches bottom
            translateX: beamOptions.translateX ?? "0px",
            rotate: beamOptions.rotate ?? 0,
          },
        }}
        transition={{
          duration: beamOptions.duration ?? 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay ?? 0,
          repeatDelay: beamOptions.repeatDelay ?? 0,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full",
          "bg-gradient-to-t from-primary via-primary/40 to-transparent",
          beamOptions.className,
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ✅ Fix: generate spans INSIDE component so randomness refreshes each explosion
const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = useRef(
    Array.from({ length: 20 }, (_, index) => ({
      id: index,
      directionX: Math.floor(Math.random() * 80 - 40),
      directionY: Math.floor(Math.random() * -50 - 10),
      duration: Math.random() * 1.5 + 0.5,
    })),
  );

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-px w-10 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
      />
      {spans.current.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: span.duration, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-primary/70"
        />
      ))}
    </div>
  );
};
