import {
  type BaseSchema,
  type BaseIssue,
  type InferOutput,
  parse,
  InferInput,
} from "valibot";
import { getToken, url } from "./config";
import {
  RequestSchema,
  SearchParametersSchema,
} from "../API/containers/Request";

export async function fetchApi<
  P extends SearchParametersSchema,
  R extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined,
  D extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(_: {
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  schema: RequestSchema<P, R, D>;
  searchParams: { [K in keyof P]: InferInput<P[K]> };
  requestBody: R extends BaseSchema<unknown, unknown, BaseIssue<unknown>>
    ? InferInput<R>
    : undefined;
}): Promise<InferOutput<D>>;
export async function fetchApi<
  P extends SearchParametersSchema,
  R extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined,
  D extends undefined,
>(_: {
  path: string;
  method: "POST" | "PATCH" | "DELETE";
  schema: RequestSchema<P, R, D>;
  searchParams: { [K in keyof P]: InferInput<P[K]> };
  requestBody: R extends BaseSchema<unknown, unknown, BaseIssue<unknown>>
    ? InferInput<R>
    : undefined;
}): Promise<void>;
export async function fetchApi<
  P extends SearchParametersSchema,
  R extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined,
  D extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined,
>({
  path,
  method,
  schema,
  searchParams,
  requestBody,
}: {
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  schema: RequestSchema<P, R, D>;
  searchParams: { [K in keyof P]: InferInput<P[K]> };
  requestBody: R extends BaseSchema<unknown, unknown, BaseIssue<unknown>>
    ? InferInput<R>
    : undefined;
}) {
  const newUrl = new URL(path, url);
  for (const [key, value] of Object.entries(searchParams)) {
    newUrl.searchParams.set(key, JSON.stringify(value));
  }
  const headers: Record<string, string> = {};
  if (searchParams.responseBody) {
    headers["Content-Type"] = "application/json";
  }
  const token = await getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(newUrl, {
    method,
    body: requestBody ? JSON.stringify(requestBody) : undefined,
    headers,
  });
  if (!response.ok) {
    throw new Error(`Received bad response: ${await response.text()}`);
  }
  if (schema.responseBody) {
    return parse(schema.responseBody, await response.json());
  }
}
