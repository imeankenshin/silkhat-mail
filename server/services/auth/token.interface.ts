export interface ITokenService {
  getGoogleAccessToken(userId: string): Promise<Result<string | null, Error>>
}
