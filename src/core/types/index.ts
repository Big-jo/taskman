export type AuthUser = {
  id: string;
  email: string;
}
export type ExtendedRequest = Request & {
  user: AuthUser;
};