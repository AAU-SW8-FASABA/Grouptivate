import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Signin from "@/app/signin";

// Mock dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@/lib/server/login", () => ({
  login: jest.fn(),
}));

jest.mock("@/lib/states/userState", () => ({
  useUser: () => ({
    setUser: jest.fn(),
  }),
}));

jest.mock("@/lib/server/user", () => ({
  get: jest.fn(),
}));

describe("Signin", () => {
  it("logs in successfully", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signin />);

    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByTestId("login-button");

    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(passwordInput, "password123");

    // Mock login success
    const loginApi = require("@/lib/server/login").login;
    const getUser = require("@/lib/server/user").get;
    loginApi.mockResolvedValue(true);
    getUser.mockResolvedValue({ id: 1, username: "testuser" });

    fireEvent.press(loginButton);

    // Wait for stuff
    await waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith("testuser", "password123");
      expect(getUser).toHaveBeenCalled();
    });
  });

  it("handles login failure", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signin />);

    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByTestId("login-button");

    fireEvent.changeText(usernameInput, "wronguser");
    fireEvent.changeText(passwordInput, "wrongpass");

    const loginApi = require("@/lib/server/login").login;
    loginApi.mockResolvedValue(false);

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith("wronguser", "wrongpass");
    });
  });
});

