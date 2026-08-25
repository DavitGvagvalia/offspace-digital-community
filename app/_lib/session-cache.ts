"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

const SESSION_CACHE_REVALIDATE_MS = 5 * 60 * 1000;

type SessionCacheEntry<T> = {
  data?: T;
  hasData: boolean;
  promise?: Promise<T>;
  updatedAt: number;
};

type UseSessionCachedQueryOptions<T> = {
  key: string | null;
  enabled?: boolean;
  fetcher: () => Promise<T>;
  revalidateMs?: number;
};

type UseSessionCachedQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: unknown;
  revalidate: () => Promise<void>;
  setLocalData: Dispatch<SetStateAction<T | null>>;
};

const sessionDataCache = new Map<string, SessionCacheEntry<unknown>>();

function readSessionCachedData<T>(key: string): T | undefined {
  const entry = sessionDataCache.get(key);

  if (!entry?.hasData) {
    return undefined;
  }

  return entry.data as T;
}

function writeSessionCachedData<T>(key: string, data: T) {
  sessionDataCache.set(key, {
    data,
    hasData: true,
    updatedAt: Date.now(),
  });
}

function clearSessionDataCache(key?: string) {
  if (key) {
    sessionDataCache.delete(key);
    return;
  }

  sessionDataCache.clear();
}

function loadSessionCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { force?: boolean } = {},
): Promise<T> {
  const cachedEntry = sessionDataCache.get(key) as
    | SessionCacheEntry<T>
    | undefined;

  if (!options.force && cachedEntry?.hasData) {
    return Promise.resolve(cachedEntry.data as T);
  }

  if (cachedEntry?.promise) {
    return cachedEntry.promise;
  }

  const promise = fetcher()
    .then((data) => {
      writeSessionCachedData(key, data);
      return data;
    })
    .finally(() => {
      const nextEntry = sessionDataCache.get(key);

      if (nextEntry?.promise === promise) {
        sessionDataCache.set(key, {
          ...nextEntry,
          promise: undefined,
        });
      }
    });

  sessionDataCache.set(key, {
    data: cachedEntry?.data,
    hasData: cachedEntry?.hasData ?? false,
    promise,
    updatedAt: cachedEntry?.updatedAt ?? 0,
  });

  return promise;
}

function useSessionCachedQuery<T>({
  key,
  enabled = true,
  fetcher,
  revalidateMs = SESSION_CACHE_REVALIDATE_MS,
}: UseSessionCachedQueryOptions<T>): UseSessionCachedQueryResult<T> {
  const fetcherRef = useRef(fetcher);
  const [localState, setLocalState] = useState<{
    key: string | null;
    data: T | null;
  }>({
    key: null,
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const revalidate = useCallback(async () => {
    if (!key || !enabled) {
      return;
    }

    const nextData = await loadSessionCachedData(
      key,
      () => fetcherRef.current(),
      {
        force: true,
      },
    );

    setLocalState({
      key,
      data: nextData,
    });
    setError(null);
  }, [enabled, key]);

  const setLocalData = useCallback<Dispatch<SetStateAction<T | null>>>(
    (nextData) => {
      setLocalState((currentState) => {
        const currentData =
          currentState.key === key ? currentState.data : null;

        return {
          key,
          data:
            typeof nextData === "function"
              ? (nextData as (currentData: T | null) => T | null)(currentData)
              : nextData,
        };
      });
    },
    [key],
  );

  useEffect(() => {
    let isMounted = true;
    const scheduleStateUpdate = (update: () => void) => {
      window.queueMicrotask(() => {
        if (isMounted) {
          update();
        }
      });
    };

    if (!key || !enabled) {
      scheduleStateUpdate(() => {
        setLocalState({
          key: null,
          data: null,
        });
        setIsLoading(false);
        setError(null);
      });

      return () => {
        isMounted = false;
      };
    }

    const cachedData = readSessionCachedData<T>(key);

    if (cachedData !== undefined) {
      scheduleStateUpdate(() => {
        setLocalState({
          key,
          data: cachedData,
        });
        setIsLoading(false);
        setError(null);
      });
    } else {
      scheduleStateUpdate(() => {
        setLocalState({
          key,
          data: null,
        });
        setIsLoading(true);
        setError(null);
      });

      loadSessionCachedData(key, () => fetcherRef.current())
        .then((nextData) => {
          if (isMounted) {
            setLocalState({
              key,
              data: nextData,
            });
            setError(null);
          }
        })
        .catch((loadError) => {
          console.error(loadError);

          if (isMounted) {
            setError(loadError);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }

    const intervalId =
      revalidateMs > 0
        ? window.setInterval(() => {
            loadSessionCachedData(
              key,
              () => fetcherRef.current(),
              {
                force: true,
              },
            )
              .then((nextData) => {
                if (isMounted) {
                  setLocalState({
                    key,
                    data: nextData,
                  });
                  setError(null);
                }
              })
              .catch((revalidateError) => {
                console.error(revalidateError);

                if (isMounted && readSessionCachedData<T>(key) === undefined) {
                  setError(revalidateError);
                }
              });
          }, revalidateMs)
        : undefined;

    return () => {
      isMounted = false;

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [enabled, key, revalidateMs]);

  const cachedDataForRender = key ? readSessionCachedData<T>(key) : undefined;
  const hasCachedData = cachedDataForRender !== undefined;
  const data =
    localState.key === key
      ? localState.data
      : cachedDataForRender !== undefined
        ? cachedDataForRender
        : null;
  const shouldWaitForFirstLoad =
    Boolean(key && enabled) && data === null && !error && !hasCachedData;

  return {
    data,
    isLoading: isLoading || shouldWaitForFirstLoad,
    error,
    revalidate,
    setLocalData,
  };
}

export {
  SESSION_CACHE_REVALIDATE_MS,
  clearSessionDataCache,
  loadSessionCachedData,
  useSessionCachedQuery,
};
