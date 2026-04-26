"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = isMobile ? [0.85, 0.95] : [1.05, 1];

  const rotate = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], scaleDimensions);
  // On mobile: smaller translate so card doesn't get pushed too far down
  const translate = useTransform(
    scrollYProgress,
    [0, 0.5],
    isMobile ? [0, -30] : [0, -100],
  );

  return (
    <div
      className="h-full flex items-start justify-center relative p-2 md:p-10"
      ref={containerRef}
    >
      <div
        className="sticky top-10 md:top-16 py-4 md:py-20 w-full"
        style={{ perspective: "1000px" }}
      >
        <Header
          translate={translate}
          titleComponent={titleComponent}
          isMobile={isMobile}
        />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Header = ({ translate, titleComponent, isMobile }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center pt-20"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-3xl mx-auto w-full border border-border p-2 md:p-3 rounded-2xl shadow-2xl"
    >
      <div className="w-full overflow-hidden">{children}</div>
    </motion.div>
  );
};
