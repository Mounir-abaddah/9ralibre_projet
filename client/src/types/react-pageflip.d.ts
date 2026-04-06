// src/types/react-pageflip.d.ts
declare module "react-pageflip" {
  import React from "react";

  export interface HTMLFlipBookProps {
    width?: number;
    height?: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    className?: string;
    children?: React.ReactNode;
  }

  export class HTMLFlipBook extends React.Component<HTMLFlipBookProps> {}
  export default HTMLFlipBook;
}