"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string;
}

export function SubmitButton({ children, pendingText, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending || props.disabled} className={className} {...props}>
      {pending && <span className="loading loading-spinner loading-sm"></span>}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
