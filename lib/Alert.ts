import { Alert } from "react-native";

export enum ErrorType {
  ParsedRequestError = "ParsedRequestError", // Non 200 code and error message from server
  ValibotParseError = "ValibotParseError", // Valibot parse error = Schema mismatch between client / server
  NativeParseError = "NativeParseError", // Error thrown by response.text() or response.json()
  NetworkError = "NetworkError", // Error thrown by fetch call
  InputError = "InputError",
}

export type ErrorMessage = {
  error: ErrorType;
  message: string;
};

const titles: Record<ErrorType, string> = {
  [ErrorType.ParsedRequestError]: "Error",
  [ErrorType.ValibotParseError]: "Internal Error",
  [ErrorType.NativeParseError]: "Internal Native Error",
  [ErrorType.NetworkError]: "Network Error",
  [ErrorType.InputError]: "Input Error",
};

export function showAlert(error: ErrorMessage) {
  let message = error.message;
  switch (error.error) {
    case ErrorType.NativeParseError:
    case ErrorType.NetworkError:
      message = "Please try again";
      break;
    case ErrorType.ValibotParseError:
      message = "An update is required";
      break;
  }

  return Alert.alert(titles[error.error], message, [
    {
      text: "Dismiss",
    },
  ]);
}
