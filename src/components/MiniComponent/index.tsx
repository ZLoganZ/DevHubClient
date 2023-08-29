import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { getTheme } from "@/utils/functions/ThemeFunction";
import { Button } from "antd";
import StyleTotal from "./cssMiniComponent";

// ===========================================

type ButtonActiveHoverProps = {
  children?: ReactNode;
  onClick?: any;
  loading?: boolean;
  rounded?: boolean;
  block?: boolean;
};

export const ButtonActiveHover = ({
  children,
  onClick,
  loading,
  rounded,
  block,
}: ButtonActiveHoverProps) => {
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  return (
    <StyleTotal theme={themeColorSet}>
      <Button
        className="ButtonActiveHover font-bold px-6 py-2"
        onClick={onClick}
        loading={loading}
        style={{
          height: "100%",
          borderRadius: rounded ? "1.5rem" : "0",
          width: block ? "100%" : "auto",
        }}>
        {children}
      </Button>
    </StyleTotal>
  );
};

// ===========================================

export const ButtonActiveNonHover = () => {
  return <div></div>;
};

// ===========================================

type ButtonCancelHoverProps = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const ButtonCancelHover = ({
  children,
  onClick,
  disabled,
}: ButtonCancelHoverProps) => {
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();
  return (
    <StyleTotal theme={themeColorSet}>
      <Button
        className="ButtonCancelHover font-bold px-6 py-2 rounded-3xl"
        onClick={onClick}
        style={{ height: "100%" }}
        disabled={disabled}>
        {children}
      </Button>
    </StyleTotal>
  );
};

// ===========================================

export const ButtonCancelNonHover = () => {
  return <div></div>;
};

// ===========================================
