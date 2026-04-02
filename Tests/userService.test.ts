import { UserService } from "../Services/userService";

// ─── Mock the Supabase client ────────────────────────────────────────────────
jest.mock("../src/config/supabaseClient.js", () => {
    const selectMock  = jest.fn();
    const eqMock      = jest.fn();
    const updateMock  = jest.fn();
    const fromMock    = jest.fn();

    // Each method returns the chain object so calls can be chained
    // e.g. supabase.from(...).update(...).eq(...).select()
    selectMock.mockReturnValue({ data: null, error: null });
    eqMock.mockReturnValue({ select: selectMock });
    updateMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ update: updateMock, select: selectMock, eq: eqMock });

    return {
        __esModule: true,
        default: { from: fromMock },
    };
});

import supabase from "../src/config/supabaseClient.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Grabs the mock at any level of the chain so we can override return values
const fromMock   = supabase.from        as jest.Mock;
const chainOf    = (from: jest.Mock) => from.mock.results[0]?.value as Record<string, jest.Mock>;

beforeEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────
// updateSide
// ─────────────────────────────────────────────────────────────────────────────
describe("UserService.updateSide", () => {

    it("returns true on a successful update", async () => {
        fromMock.mockReturnValue({
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue({ data: [{ side: null }], error: null }),
                }),
            }),
        });

        const result = await UserService.updateSide("uuid-123", true);

        expect(result).toBe(true);
    });

    it("queries the correct table with the correct values", async () => {
        const selectMock = jest.fn().mockResolvedValue({ data: [{ side: null }], error: null });
        const eqMock     = jest.fn().mockReturnValue({ select: selectMock });
        const updateMock = jest.fn().mockReturnValue({ eq: eqMock });
        fromMock.mockReturnValue({ update: updateMock });

        await UserService.updateSide("uuid-123", false);

        expect(fromMock).toHaveBeenCalledWith("Users");
        expect(updateMock).toHaveBeenCalledWith({ side: false });
        expect(eqMock).toHaveBeenCalledWith("id", "uuid-123");
    });

    it("throws a descriptive error when the DB call fails", async () => {
        fromMock.mockReturnValue({
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
                }),
            }),
        });

        await expect(UserService.updateSide("uuid-123", true)).rejects.toThrow(
            "Connection to DB Failed! Could not update Side! Function: updateSide()"
        );
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserSide
// ─────────────────────────────────────────────────────────────────────────────
describe("UserService.getUserSide", () => {

    it("returns the side value for a given user", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: [{ side: true }], error: null }),
            }),
        });

        const result = await UserService.getUserSide("uuid-123");

        expect(result).toBe(true);
    });

    it("returns false when the user's side is false", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: [{ side: false }], error: null }),
            }),
        });

        const result = await UserService.getUserSide("uuid-123");

        expect(result).toBe(false);
    });

    it("queries the correct table, column, and user ID", async () => {
        const eqMock     = jest.fn().mockResolvedValue({ data: [{ side: true }], error: null });
        const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
        fromMock.mockReturnValue({ select: selectMock });

        await UserService.getUserSide("uuid-123");

        expect(fromMock).toHaveBeenCalledWith("Users");
        expect(selectMock).toHaveBeenCalledWith("side");
        expect(eqMock).toHaveBeenCalledWith("id", "uuid-123");
    });

    it("throws when the DB call returns an error", async () => {
        const dbError = new Error("Query failed");
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: null, error: dbError }),
            }),
        });

        await expect(UserService.getUserSide("uuid-123")).rejects.toThrow("Query failed");
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// doesUserHaveTakeAndSide
// ─────────────────────────────────────────────────────────────────────────────
describe("UserService.doesUserHaveTakeAndSide", () => {

    it("returns { hasTake: true, hasSide: true } when both fields are set", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [{ side: true, take_id: "take-abc" }],
                    error: null,
                }),
            }),
        });

        const result = await UserService.doesUserHaveTakeAndSide("uuid-123");

        expect(result).toEqual({ hasTake: true, hasSide: true });
    });

    it("returns { hasTake: false, hasSide: false } when both fields are null", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [{ side: null, take_id: null }],
                    error: null,
                }),
            }),
        });

        const result = await UserService.doesUserHaveTakeAndSide("uuid-123");

        expect(result).toEqual({ hasTake: false, hasSide: false });
    });

    it("returns { hasTake: false, hasSide: true } when side is set but take_id is null", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [{ side: true, take_id: null }],
                    error: null,
                }),
            }),
        });

        const result = await UserService.doesUserHaveTakeAndSide("uuid-123");

        expect(result).toEqual({ hasTake: false, hasSide: true });
    });

    it("returns { hasTake: true, hasSide: false } when take_id is set but side is null", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [{ side: null, take_id: "take-abc" }],
                    error: null,
                }),
            }),
        });

        const result = await UserService.doesUserHaveTakeAndSide("uuid-123");

        expect(result).toEqual({ hasTake: true, hasSide: false });
    });

    it("throws a descriptive error when the DB call fails", async () => {
        fromMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
            }),
        });

        await expect(UserService.doesUserHaveTakeAndSide("uuid-123")).rejects.toThrow(
            "Connection to DB Failed!"
        );
    });
});