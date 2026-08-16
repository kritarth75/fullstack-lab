import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App.jsx";

describe("Event Calendar", () => {
  it("renders events after loading", async () => {
    render(<App />);
    expect(await screen.findByText("Team Standup")).toBeInTheDocument();
  });

  it("moves an event to a new slot on drag and drop", async () => {
    render(<App />);
    const card = await screen.findByText("Team Standup");

    const dataTransfer = {
      data: {},
      setData(key, value) {
        this.data[key] = value;
      },
      getData(key) {
        return this.data[key];
      }
    };

    fireEvent.dragStart(card, { dataTransfer });

    const targetSlot = screen.getByTestId("slot-Fri-14:00");
    fireEvent.dragOver(targetSlot);
    fireEvent.drop(targetSlot, { dataTransfer });

    await waitFor(() => {
      expect(targetSlot).toHaveTextContent("Team Standup");
    });
  });

  it("filters events by search text", async () => {
    render(<App />);
    await screen.findByText("Team Standup");

    const input = screen.getByPlaceholderText("Search events...");
    fireEvent.change(input, { target: { value: "Demo" } });

    expect(screen.queryByText("Team Standup")).not.toBeInTheDocument();
    expect(screen.getByText("Demo Day")).toBeInTheDocument();
  });
});
