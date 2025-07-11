import type { ITokenService } from './token.interface'

export class TokenService implements ITokenService {
  async getGoogleAccessToken(
    userId: string
  ): Promise<Result<string | null, Error>> {
    const { data: account, error } = await tryCatch(
      useDB()
        .select({
          id: tables.account.id,
          refreshToken: tables.account.refreshToken,
          providerId: tables.account.providerId,
          accessToken: tables.account.accessToken,
          accessTokenExpiresAt: tables.account.accessTokenExpiresAt
        })
        .from(tables.account)
        .where(
          and(
            eq(tables.account.userId, userId),
            eq(tables.account.providerId, 'google')
          )
        )
        .limit(1)
    )

    if (error !== null) {
      return failure(new Error('Failed to fetch account'))
    }

    if (!account.length || !account[0].accessToken) {
      return success(null)
    }

    // アクセストークンの有効期限をチェック
    const now = new Date()
    if (
      account[0].accessTokenExpiresAt
      && account[0].accessTokenExpiresAt < now
    ) {
      // リフレッシュトークンを使用してアクセストークンを更新
      return await this.#refreshAccessToken(account[0])
    }

    return success(account[0].accessToken)
  }

  async #refreshAccessToken(account: {
    id: string
    refreshToken: string | null
  }): Promise<Result<string | null, Error>> {
    if (!account.refreshToken) {
      return success(null)
    }

    const google = useGoogleOAuth()
    google.setCredentials({ refresh_token: account.refreshToken })

    const { data: response, error: refreshAccessTokenError } = await tryCatch(
      google.refreshAccessToken()
    )
    if (refreshAccessTokenError !== null) {
      return failure(new Error('Failed to refresh token.', {
        cause: refreshAccessTokenError
      }))
    }

    const data = response?.res?.data
    if (!data) {
      return failure(new Error('Failed to refresh token: response data is missing.'))
    }
    const newAccessToken = data.access_token
    const expiresIn = data.expires_in || 3600
    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    // データベースのアクセストークンを更新
    const { error } = await tryCatch(
      useDB()
        .update(tables.account)
        .set({
          accessToken: newAccessToken,
          accessTokenExpiresAt: expiresAt
        })
        .where(eq(tables.account.id, account.id))
    )
    if (error !== null) {
      return failure(error)
    }

    return success(newAccessToken)
  }
}
