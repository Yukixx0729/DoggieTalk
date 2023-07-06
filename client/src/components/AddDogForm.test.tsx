import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import MyDogs from "../components/MyDogs";
import userEvent from "@testing-library/user-event";
import AddDogForm from "./AddDogForm";
import { vi } from "vitest";
import { spyOn } from "@vitest/spy";

beforeEach(() => {
  vi.resetAllMocks();
});

const mockOnSubmit = vi.fn();
const mockSetDogs = vi.fn();
const mockSetNoDogs = vi.fn();

// const dogInfo = {
//   name: "tiger",
//   breed: "jack russell",
//   age: "4",
// };

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
  await user.click(dogNameInput);
  await user.type(dogNameInput, "Tiger");
  expect(dogNameInput.value).toEqual("Tiger");
});

it("should only show the form when clicked", async () => {
  const user = userEvent.setup();
  render(<MyDogs />);
  const btn = screen.getByText("Add my dog(s)");
  const nameInput = screen.queryByPlaceholderText("dog's name");
  expect(nameInput).toBeNull();
  user.click(btn);
  await waitFor(() => {
    const nameInput = screen.getByPlaceholderText("dog's name");
    expect(nameInput).toBeInTheDocument();
  });
});

// it("should call on submit with all fields typed and clicked", async () => {
//   const user = userEvent.setup();
//   render(<AddDogForm setDogs={mockSetDogs} setNoDogs={mockSetNoDogs} />);
//   const addBtn = screen.getByText("add") as HTMLInputElement;
//   const form = screen.getByRole("form");
//   const event = createEvent.submit(form);
//   const spy = vi.spyOn(dogInfo, mockOnSubmit(form) as never);

//   await userEvent.click(addBtn);
//   await fireEvent.submit(form, event);
//   const dogNameInput = screen.getByPlaceholderText(
//     "dog's name"
//   ) as HTMLInputElement;
//   const dogBreedInput = screen.getByPlaceholderText(
//     "dog's breed"
//   ) as HTMLInputElement;
//   const dogAgeInput = screen.getByPlaceholderText(
//     "dog's age"
//   ) as HTMLInputElement;

//   await userEvent.click(dogNameInput);
//   await user.type(dogNameInput, "Tiger");
//   await userEvent.click(dogBreedInput);
//   await user.type(dogBreedInput, "Corgi");
//   await userEvent.click(dogAgeInput);
//   await user.type(dogAgeInput, "3");
//   await user.click(addBtn);
//   expect(spy).toBeCalled();
// });

it.only("should call on submit with all fields typed and clicked", async () => {
  const user = userEvent.setup();
  render(<AddDogForm setDogs={mockSetDogs} setNoDogs={mockSetNoDogs} />);
  const form = screen.getByRole("form");
  // const handleSubmitSpy = spyOn(AddDogForm.prototype, "handleSubmit");

  const dogNameInput = screen.getByPlaceholderText(
    "dog's name"
  ) as HTMLInputElement;
  await user.click(dogNameInput);
  await user.type(dogNameInput, "Tiger");
  const event = createEvent.submit(form);
  fireEvent.submit(form);
  expect(event).toHaveBeenCalled();
});
