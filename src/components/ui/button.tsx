"use client";

import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
}

export function Button({
  children,
  variant = "contained",
  color = "success",
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      color={color}
      sx={{ borderRadius: "15px", textTransform: "none", fontWeight: 600, fontFamily: 'Asset', ...props.sx }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
