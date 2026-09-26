import { Request } from "express";

export interface AuthenticatedUser {
  userId: string;
  id?: string;
  email?: string;
}

export interface AuthenticatedRequest<TParams = any, TBody = any, TQuery = any>
  extends Request<TParams, any, TBody, TQuery> {
  user: AuthenticatedUser;
  userId: string;
}

export type AuthOnlyRequest = AuthenticatedRequest<any, any, any>;
export type AuthWithParams<TParams> = AuthenticatedRequest<TParams>;
export type AuthWithQuery<TQuery> = AuthenticatedRequest<any, any, TQuery>;
export type AuthWithBody<TBody> = AuthenticatedRequest<any, TBody, any>;

export type BodyRequest<T> = Request<any, any, T>;
export type QueryRequest<T> = Request<any, any, any, T>;
export type ParamsRequest<T> = Request<T>;
export type FullRequest<TParams, TBody, TQuery> = Request<
  TParams,
  any,
  TBody,
  TQuery
>;

export interface BaseListRequest {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
}
