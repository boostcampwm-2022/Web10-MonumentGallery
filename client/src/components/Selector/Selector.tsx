import React, {useState} from "react";
import "./style.scss";

type selectorValue = unknown | null;

interface SelectorWrapperProps {
  className: string;
  title: string | null;
  children: React.ReactNode;
}

interface SelectorItemProps {
  value: selectorValue;
  className: string;
  children: React.ReactNode;
}

export function useSelectorComponent(defaultSelect: selectorValue) {
  const [selected, setSelected] = useState<selectorValue>(defaultSelect ?? null);

  function SelectorItem({value, className="", children}: SelectorItemProps) {
    function onClick() {
      setSelected(value);
    }
    const isSelected = selected === value;

    return <div 
      className={`selector-item ${className} ${isSelected ? "selected" : ""}`} 
      onClick={onClick}
    >
      {children}
    </div>;
  }

  function SelecterWrapper({className="", title=null, children}: SelectorWrapperProps) {
    return <div className={`selector-wrapper ${className ?? ""}`}>
      {title && <h3 className="selector-title">{title}</h3>}
      <div className="selector-list">
        {children}
      </div>
    </div>;
  }

  return [selected, SelecterWrapper, SelectorItem];
}