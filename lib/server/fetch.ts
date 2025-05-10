import {
  type BaseSchema,
  type BaseIssue,
  type InferOutput,
  safeParse,
  InferInput,
} from "valibot";
import { getToken, url } from "./config";
import {
  RequestSchema,
  SearchParametersSchema,
} from "../API/containers/Request";
import { ErrorMessageSchema } from "../API/schemas/Error";
import { ErrorMessage, ErrorType } from "../Alert";

export type FetchReturnType<T> =
  | ErrorMessage
  | {
      data: T;
      error: null;
    };

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

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
}): Promise<FetchReturnType<InferOutput<D>>>;

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
}): Promise<FetchReturnType<null>>;

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
  // Initialize variables
  const newUrl = new URL(path, url);
  const headers: Record<string, string> = {};

  // Parse request body
  if (schema.requestBody) {
    const parsedRequestBody = safeParse(schema.requestBody, requestBody);

    if (!parsedRequestBody.success) {
      return {
        error: ErrorType.InputError,
        message: parsedRequestBody.issues.join(", "),
      };
    }
  }

  // Set search params
  // TODO: Parse
  for (const [key, value] of Object.entries(searchParams)) {
    newUrl.searchParams.set(key, JSON.stringify(value));
  }

  // Set Content-Type
  if (schema.requestBody) {
    headers["Content-Type"] = "application/json;charset=UTF-8";
  }

  // Set token
  const token = await getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Perform request
  let response;
  try {
    response = await fetch(newUrl, {
      method,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      headers,
    });
  } catch (error) {
    return { error: ErrorType.NetworkError, message: getErrorMessage(error) };
  }

  // Parse response
  try {
    if (!response.ok) {
      const parsedError = safeParse(ErrorMessageSchema, await response.json());
      if (parsedError.success) {
        return {
          error: ErrorType.ParsedRequestError,
          message: parsedError.output.error,
        };
      } else {
        return {
          error: ErrorType.ValibotParseError,
          message: parsedError.issues.join(", "),
        };
      }
    }
    if (schema.responseBody) {
      const parsed = safeParse(schema.responseBody, await response.json());
      if (parsed.success) {
        return { data: parsed.output };
      } else {
        return {
          error: ErrorType.ValibotParseError,
          message: parsed.issues.join(", "),
        };
      }
    }
  } catch (error) {
    return {
      error: ErrorType.NativeParseError,
      message: getErrorMessage(error),
    };
  }

  return { error: null, data: null };
}
