import { describe, expect, it } from "vitest";
import { shouldShowStormOnDayChange } from "@/lib/task-weather";

describe("Storm on day change", () => {
  it("shows a storm when moving to tomorrow with an unfinished task today", () => {
    expect(shouldShowStormOnDayChange([{ date: "2026-10-28", done: false }], "2026-10-28", "2026-10-29", "2026-10-28")).toBe(true);
  });
  it("shows a storm when visiting a past day with unfinished tasks", () => {
    expect(shouldShowStormOnDayChange([{ date: "2026-10-27", done: false }], "2026-10-28", "2026-10-27", "2026-10-28")).toBe(true);
  });
  it("does not show a storm when all tasks are completed", () => {
    expect(shouldShowStormOnDayChange([{ date: "2026-10-28", done: true }], "2026-10-28", "2026-10-29", "2026-10-28")).toBe(false);
  });
  it("does not show a storm when both days are empty", () => {
    expect(shouldShowStormOnDayChange([], "2026-10-28", "2026-10-29", "2026-10-28")).toBe(false);
  });
  it("allows the storm to repeat on a later visit", () => {
    const tasks = [{ date: "2026-10-27", done: false }];
    expect(shouldShowStormOnDayChange(tasks, "2026-10-28", "2026-10-27", "2026-10-28")).toBe(true);
    expect(shouldShowStormOnDayChange(tasks, "2026-10-27", "2026-10-28", "2026-10-28")).toBe(true);
    expect(shouldShowStormOnDayChange(tasks, "2026-10-28", "2026-10-27", "2026-10-28")).toBe(true);
  });
});