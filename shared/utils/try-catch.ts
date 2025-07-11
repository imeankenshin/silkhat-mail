export type Sucess<T> = {
  error: null
  data: T
}

export type Failure<E> = {
  error: E
  data: null
}

export type Result<T, E> = Sucess<T> | Failure<E>

export async function tryCatch<T, E extends Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise
    return success(data)
  }
  catch (error) {
    if (error instanceof Error)
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
