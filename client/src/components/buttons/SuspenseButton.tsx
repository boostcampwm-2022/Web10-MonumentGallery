import React, { Suspense } from "react";
import { Resource } from "../../utils/suspender";

interface SuspenseButtonProps {
  resource: Resource | null;
  fallback: string;
  name: string;
  onClick: () => void;
}

export default function SuspenseButton({ resource, fallback, name, onClick }: SuspenseButtonProps) {
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
          <Data resource={resource} />
        </Suspense>
      ) : (
        <button onClick={onClick}>{name}</button>
      )}
    </>
  );
}

function Data({ resource }: { resource: Resource }) {
  const data = resource.read({ method: "get", url: "/test/getData" });
  return <div style={{ overflow: "scroll" }}>{JSON.stringify(data, null, 2)}</div>;
}
