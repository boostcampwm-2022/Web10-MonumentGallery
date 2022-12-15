import React, { Suspense } from "react";
import Spinner from "../../components/Spinner";
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
              <Spinner /> {fallback}
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
