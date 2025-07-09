export type Sucess<T> = {
  error: null
  data: T
}

export type Failure<E> = {
  error: E
  data: null
}

export type Result<T, E> = Sucess<T> | Failure<E>

export function tryCatch<T, E extends Error = Error>(promise: Promise<T>): Promise<Result<T, E>>
export function tryCatch<T, E extends Error = Error>(value: T): Result<T, E>
export function tryCatch<T, E extends Error = Error>(
  maybePromise: T
): Promise<Result<T, E>> | Result<T, E> {
  try {
    if (maybePromise instanceof Promise)
      return maybePromise.then(success)
    return success(maybePromise)
  }
  catch (error) {
    if (failure instanceof Error)
      return failure(error as E)
    return failure(new Error(String(error)) as E)
  }
}

export function success<T>(data: T): Sucess<T> {
  return {
    error: null,
    data
  }
}

export function failure<E>(error: E): Failure<E> {
  return {
    error,
    data: null
  }
}
