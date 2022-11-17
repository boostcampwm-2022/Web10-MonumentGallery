import React, { Suspense } from "react";

interface SuspenseButtonProps {
  fetcher: { get: () => void } | boolean;
  fallback: string;
  name: string;
  onClick: () => void;
}

export default function SuspenseButton({ fetcher, fallback, name, onClick }: SuspenseButtonProps) {
  return (
    <>
      {fetcher ? (
        <Suspense
          fallback={
            <button>
              <i className="fa fa-circle-o-notch fa-spin"></i> {fallback}
            </button>
          }
        >
          <Data resource={fetcher} />
        </Suspense>
      ) : (
        <button onClick={onClick}>{name}</button>
      )}
    </>
  );
}

function Data({ resource }: { resource: any }) {
  const data = resource.get();
  return <div style={{ overflow: "scroll" }}>{JSON.stringify(data, null, 2)}</div>;
}
