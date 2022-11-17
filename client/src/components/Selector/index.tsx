import React, { useState } from "react";
import "./style.scss";

export type selectorValue = unknown | null;

interface SelectorWrapperProps {
  className?: string;
  title: string | null;
  children: React.ReactNode;
}

interface SelectorItemProps<T> {
  value: T;
  className?: string;
  children: React.ReactNode;
}

export default function useSelectorComponent<T>(
  defaultSelect: T,
): [
  T | null,
  ({ className, title, children }: SelectorWrapperProps) => JSX.Element,
  ({ value, className, children }: SelectorItemProps<T>) => JSX.Element,
] {
  const [selected, setSelected] = useState<T | null>(defaultSelect ?? null);

  function SelectorItem({ value, className = "", children }: SelectorItemProps<T>) {
    function onClick() {
      setSelected(value);
    }
    const isSelected = selected === value;

    return (
      <div className={`selector-item ${className} ${isSelected ? "selected" : ""}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  function SelecterWrapper({ className = "", title = null, children }: SelectorWrapperProps) {
    return (
      <div className={`selector-wrapper ${className ?? ""}`}>
        {title && <h3 className="selector-title">{title}</h3>}
        <div className="selector-list">{children}</div>
      </div>
    );
  }

  return [selected, SelecterWrapper, SelectorItem];
}
