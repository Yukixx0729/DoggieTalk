import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import MyDogs, { Dogs } from "./MyDogs";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
// import * as AuthProvider from "../contexts/AuthProvider";

const mockFetch = vi.fn();
const mockJson = vi.fn();

// const mockUserData = {
//   email: "yuki@app.com",
//   name: "Yuki",
//   id: "123",
// };

// vi.mock("../context/AuthProvider", () => {
//   useAuth: vi.fn().mockReturnValue(mockUserData);
// });

// const mockUseAuth = vi.fn(() => mockUserData);

beforeEach(() => {
  vi.resetAllMocks();
  // AuthProvider.AuthProvider = vi.fn().mockReturnValue(mockUserData);
});

// it("renders 'You haven't added your dog(s) yet.' text when no dogs are available", async () => {
//   mockJson.mockResolvedValueOnce([]);
//   mockFetch.mockResolvedValueOnce({
//     json: mockJson,
//   });
//   render(<MyDogs />);
//   expect(
//     await screen.findByText("You haven't added your dog(s) yet.")
//   ).toBeInTheDocument();
// });

it("renders dog cards when dogs are available", async () => {
  // mockUseAuth.mockResolvedValueOnce;
  // vi.mock("../contexts/AuthProvider", () => {
  //   AuthProvider: vi.fn(() => mockUserData);
  // });
  vi.mock("../contexts/AuthProvider", () => {
    return {
      useAuth: vi.fn().mockReturnValue({
        user: {
          email: "yuki@app.com",
          name: "Yuki",
          id: "123",
        },
      }),
    };
  });
  const dogs: Dogs[] = [
    {
      id: "1",
      breed: "Jack Russell",
      age: "3",
      name: "Tiger",
    },
    {
      id: "2",
      breed: "Jack Russell",
      age: "2",
      name: "Pickle",
    },
  ];
  mockJson.mockResolvedValueOnce(dogs);
  mockFetch.mockResolvedValueOnce({
    json: mockJson,
  });
  render(<MyDogs />);
  expect(await screen.findByText("MY DOG")).toBeInTheDocument();
  expect(screen.getByText("Name: Tiger Age: 3yr(s)")).toBeInTheDocument();
  expect(screen.getByText("Breed: Jack Russell")).toBeInTheDocument();
  expect(screen.getByText("Name: Pickle Age: 2yr(s)")).toBeInTheDocument();
  expect(screen.getByText("Breed: Jack Russell")).toBeInTheDocument();
});
