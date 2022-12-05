const STATUS = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
} as const;

type STATUS = typeof STATUS[keyof typeof STATUS];

type Selector<T> = Promise<T> & {
  status?: STATUS;
  value?: T;
  reason?: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectors = new Map<string, Selector<any>>();

// https://github.com/pmndrs/jotai/blob/main/src/react/useAtomValue.ts#L12
const use = <T>(promise: Selector<T>): T => {
  if (promise.status === STATUS.PENDING) {
    throw promise;
  } else if (promise.status === STATUS.FULFILLED) {
    return promise.value as T;
  } else if (promise.status === STATUS.REJECTED) {
    throw promise.reason;
  } else {
    promise.status = STATUS.PENDING;
    promise.then(
      (val) => {
        promise.status = STATUS.FULFILLED;
        promise.value = val;
      },
      (err) => {
        promise.status = STATUS.REJECTED;
        document.dispatchEvent(new CustomEvent("error-reason", { detail: err }));
        promise.reason = err;
      },
    );
    throw promise;
  }
};

export const select = <T>({ key, get }: { key: string; get: () => Selector<T> }) => {
  const selector = selectors.get(key);
  if (selector) {
    return use<T>(selector);
  } else {
    const newSelector = get();
    selectors.set(key, newSelector);
    return use<T>(newSelector);
  }
};
