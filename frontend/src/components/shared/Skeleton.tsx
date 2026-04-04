import { cn } from "@/utils";
import type { ClassValue } from "clsx";
import React, { type FC, type ReactNode } from "react";

type SkeletonProps = {
  className: ClassValue;
};

const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-stone-100", className)}
    />
  );
};

export default Skeleton;
