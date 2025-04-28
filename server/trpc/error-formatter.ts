import type { ErrorFormatter, TRPCErrorShape } from '@trpc/server/unstable-core-do-not-import'
import type { BaseIssue } from 'valibot'
import { isValiError } from 'valibot'

type ErrorShape = TRPCErrorShape & {
  data: {
    code: string
    httpStatus: number
    path?: string
    issues: BaseIssue<unknown>[] | null
    userFriendly: boolean
    [key: string]: unknown
  }
}

export const errorFormatter: ErrorFormatter<unknown, ErrorShape> = ({ error, shape }) => {
  // Valibot のバリデーションエラーを処理
  if (isValiError(error.cause)) {
    return {
      message: 'Invalid input',
      code: -32600,
      data: {
        code: 'BAD_REQUEST',
        httpStatus: 400,
        path: shape.data.path,
        issues: error.cause.issues.flat(),
        userFriendly: true
      }
    }
  }

  return {
    ...shape,
    data: {
      ...shape.data,
      issues: null,
      userFriendly: shape.data.code !== 'INTERNAL_SERVER_ERROR'
    }
  }
}
