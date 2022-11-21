import React, { Suspense } from "react";
import { Resource } from "../../utils/suspender";

interface SuspenseButtonProps {
  children?: React.ReactNode;
  resource: Resource | null;
  fallback: string;
  name: string;
  onClick: () => void;
}

export default function SuspenseButton({ children, resource, fallback, name, onClick }: SuspenseButtonProps) {
  return (
    <>
      {resource ? (
        <Suspense
          fallback={
            <button>
              <i className="fa fa-circle-o-notch fa-spin"></i> {fallback}
            </button>
          }
        >
          {children}
        </Suspense>
      ) : (
        <button onClick={onClick}>{name}</button>
      )}
    </>
  );
}
