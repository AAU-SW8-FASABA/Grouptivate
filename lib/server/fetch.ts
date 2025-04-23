import {
  type BaseSchema,
  type BaseIssue,
  type InferOutput,
  parse,
  InferInput,
} from "valibot";
import {
  RequestSchema,
  SearchParametersSchema,
} from "../API/containers/Request";

const SERVER_URL = process.env.SERVER_URL;
if (!SERVER_URL) throw new Error("Missing a SERVER_URL in env");

const url = new URL(SERVER_URL);

export async function fetchApi<
  P extends SearchParametersSchema,
  R extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined,
  D extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(_: {
  path: string;
  method: "GET" | "POST" | "DELETE";
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
  method: "POST" | "DELETE";
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
  method: "GET" | "POST" | "DELETE";
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
  const response = await fetch(url, {
    method,
    body: requestBody ? JSON.stringify(requestBody) : undefined,
  });
  if (!response.ok) {
    throw new Error("Received bad response.");
  }
  if (schema.responseBody) {
    return parse(schema.responseBody, await response.json());
  }
}
