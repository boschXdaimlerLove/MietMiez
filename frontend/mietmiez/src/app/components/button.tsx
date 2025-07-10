"use client";

import React, { CSSProperties, ReactNode } from "react";

export default function Button({
  title,
  onClick,
  isPrimary = false,
  className,
  type = "button",
  isCustom = false,
  customButtonStyle = {},
}: {
  title: ReactNode;
  onClick: () => void;
  isPrimary: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  isCustom?: boolean;
  customButtonStyle?: CSSProperties;
}) {
  if (isPrimary) {
    return (
      <button
        style={customButtonStyle}
        className={
          isCustom
            ? className
            : `bg-primary bg-[var(--primaryBtn)] text-[var(--primaryBtnTxt)] px-4 py-2 rounded-md transition-transform duration-100 active:scale-95 ${className}`
        }
        onClick={onClick}
        type={type}
      >
        {title}
      </button>
    );
  } else {
    return (
      <button
        style={customButtonStyle}
        className={
          isCustom
            ? className
            : `bg-transparent border-2 border-[var(--primaryBtn)] text-primary px-4 py-2 rounded-md transition-transform duration-100 active:scale-95 ${className}`
        }
        onClick={onClick}
        type={type}
      >
        {title}
      </button>
    );
  }
}
