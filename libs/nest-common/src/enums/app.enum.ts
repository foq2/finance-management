export enum Role {
  Admin = 'admin',
  User = 'user',
}

export enum NodeEnv {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum BodyContentType {
  Json = 'application/json',
  MultipartFormData = 'multipart/form-data',
}
export enum JwtTokenType {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}
