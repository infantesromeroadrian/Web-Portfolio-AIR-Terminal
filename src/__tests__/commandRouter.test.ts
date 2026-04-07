/**
 * Tests for command routing in src/core/commandRouter.ts
 *
 * Tests the resolveCommand function with mock terminal actions.
 * These tests verify routing logic — not formatter output.
 */

import { describe, it, expect, vi } from "vitest";
import { resolveCommand, AVAILABLE_COMMANDS } from "../core/commandRouter";

/** Create mock terminal actions for testing */
function mockActions() {
  return {
    print: vi.fn(),
    clear: vi.fn(),
    toggleL4tent: vi.fn(),
  };
}

describe("resolveCommand", () => {
  it("routes 'whoami' to print (not clear)", () => {
    const actions = mockActions();
    resolveCommand("whoami", actions);
    expect(actions.print).toHaveBeenCalledTimes(1);
    expect(actions.clear).not.toHaveBeenCalled();
  });

  it("routes 'clear' to clear action", () => {
    const actions = mockActions();
    resolveCommand("clear", actions);
    expect(actions.clear).toHaveBeenCalledTimes(1);
    expect(actions.print).not.toHaveBeenCalled();
  });

  it("trims whitespace before routing", () => {
    const actions = mockActions();
    resolveCommand("  whoami  ", actions);
    expect(actions.print).toHaveBeenCalledTimes(1);
  });

  it("ignores empty input", () => {
    const actions = mockActions();
    resolveCommand("", actions);
    expect(actions.print).not.toHaveBeenCalled();
    expect(actions.clear).not.toHaveBeenCalled();
  });

  it("prints error for unknown commands", () => {
    const actions = mockActions();
    resolveCommand("nonexistent-command-xyz", actions);
    expect(actions.print).toHaveBeenCalledTimes(1);
    const output = actions.print.mock.calls[0][0] as string;
    expect(output).toContain("Command not found");
    expect(output).toContain("nonexistent-command-xyz");
  });

  it("routes 'help' to print", () => {
    const actions = mockActions();
    resolveCommand("help", actions);
    expect(actions.print).toHaveBeenCalledTimes(1);
    const output = actions.print.mock.calls[0][0] as string;
    expect(output.length).toBeGreaterThan(0);
  });
});

describe("AVAILABLE_COMMANDS", () => {
  it("is a non-empty array of strings", () => {
    expect(Array.isArray(AVAILABLE_COMMANDS)).toBe(true);
    expect(AVAILABLE_COMMANDS.length).toBeGreaterThan(10);
  });

  it("includes essential commands", () => {
    const essential = ["whoami", "help", "clear", "skills", "proyectos", "classify"];
    for (const cmd of essential) {
      expect(AVAILABLE_COMMANDS).toContain(cmd);
    }
  });

  it("has no duplicate entries", () => {
    const unique = new Set(AVAILABLE_COMMANDS);
    expect(unique.size).toBe(AVAILABLE_COMMANDS.length);
  });
});
