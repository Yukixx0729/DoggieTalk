import { render, screen } from "@testing-library/react";
// import MyDogs from "../components/MyDogs";
import userEvent from "@testing-library/user-event";
import AddDogForm from "./AddDogForm";
import { vi } from "vitest";

beforeEach(() => {
  vi.resetAllMocks();
});

// const mockOnSubmit = vi.fn();
const mockSetDogs = vi.fn();
const mockSetNoDogs = vi.fn();

it("render form fiedls", () => {
  render(<AddDogForm setDogs={mockSetDogs} setNoDogs={mockSetNoDogs} />);
  const dogName = screen.getByPlaceholderText("dog's name");
  expect(dogName).toBeInTheDocument();
});

it("should display the dog's name entered by the user", async () => {
  render(<AddDogForm setDogs={mockSetDogs} setNoDogs={mockSetNoDogs} />);
  const user = userEvent.setup();
  const dogNameInput = screen.getByPlaceholderText(
    "dog's name"
  ) as HTMLInputElement;
  await userEvent.click(dogNameInput);
  await user.type(dogNameInput, "Tiger");
  expect(dogNameInput.value).toEqual("Tiger");
});

// it("should call on submit with all fields typed", async () => {
//   const user = userEvent.setup();
//   render(<AddDogForm setDogs={mockSetDogs} setNoDogs={mockSetNoDogs} />);
//   const dogNameInput = screen.getByPlaceholderText(
//     "dog's name"
//   ) as HTMLInputElement;
//   const dogBreedInput = screen.getByPlaceholderText(
//     "dog's breed"
//   ) as HTMLInputElement;
//   const dogAgeInput = screen.getByPlaceholderText(
//     "dog's age"
//   ) as HTMLInputElement;

//   const addBtn = screen.getByText("add") as HTMLInputElement;
//   const submitSpy = vi.spyOn(AddDogForm, "handleSubmit");
//   await userEvent.click(dogNameInput);
//   await user.type(dogNameInput, "Tiger");
//   await userEvent.click(dogBreedInput);
//   await user.type(dogBreedInput, "Corgi");
//   await userEvent.click(dogAgeInput);
//   await user.type(dogAgeInput, "3");
//   await user.click(addBtn);

//   expect(submitSpy).toHaveBeenCalled();
// });
