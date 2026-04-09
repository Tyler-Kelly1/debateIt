import { TakeServices } from "../Services/takesService";
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

// ─── Mock the Supabase client ────────────────────────────────────────────────
vi.mock("../src/config/supabaseClient.js", () => {
    return {
        __esModule: true,
        default: {
            from: vi.fn(),
            channel: vi.fn(),
        },
    };
});

import supabase from "../src/config/supabaseClient.js";

const mockFrom    = supabase.from    as Mock;
const mockChannel = supabase.channel as Mock;

beforeEach(() => vi.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────
// subscribeToTakesUpdates
// ─────────────────────────────────────────────────────────────────────────────
describe("TakeServices.subscribeToTakesUpdates", () => {

    // Helper that builds the fake channel chain and returns the .on mock
    // so individual tests can inspect or trigger it
    function buildChannelChain(onImpl?: (event: string, filter: object, cb: Function) => any) {
        const subscribeMock = vi.fn().mockReturnValue({ status: "SUBSCRIBED" });
        const onMock = vi.fn().mockImplementation(onImpl ?? ((_e, _f, _cb) => ({ subscribe: subscribeMock })));
        mockChannel.mockReturnValue({ on: onMock });
        return { onMock, subscribeMock };
    }

    it("calls channel with the correct channel name", () => {
        const { onMock } = buildChannelChain();
        onMock.mockReturnValue({ subscribe: vi.fn() });

        TakeServices.subscribeToTakesUpdates(vi.fn());

        expect(mockChannel).toHaveBeenCalledWith("take_updates");
    });

    it("registers a listener for INSERT events on the Takes table", () => {
        const { onMock } = buildChannelChain();
        onMock.mockReturnValue({ subscribe: vi.fn() });

        TakeServices.subscribeToTakesUpdates(vi.fn());

        expect(onMock).toHaveBeenCalledWith(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "Takes" },
            expect.any(Function)
        );
    });

    it("calls assignTakeToSide with a correctly formatted take when a new row arrives", () => {
        const assignTakeToSide = vi.fn();

        // Capture the callback that .on() receives so we can fire it manually
        let capturedCallback: Function | null = null;
        const subscribeMock = vi.fn();
        const onMock = vi.fn().mockImplementation((_event, _filter, cb) => {
            capturedCallback = cb;
            return { subscribe: subscribeMock };
        });
        mockChannel.mockReturnValue({ on: onMock });

        TakeServices.subscribeToTakesUpdates(assignTakeToSide);

        // Simulate Supabase firing the callback with a new DB row
        const fakePayload = {
            new: {
                take_id: "take-abc",
                message: "This is a take",
                user_id: "uuid-123",
                topic: "Climate Change",
                side: true,
            },
        };
        capturedCallback!(fakePayload);

        expect(assignTakeToSide).toHaveBeenCalledWith({
            take_id: "take-abc",
            message: "This is a take",
            user_id: "uuid-123",
            topic: "Climate Change",
            side: true,
        });
    });

    it("returns the result of .subscribe()", () => {
        const fakeSubscription = { status: "SUBSCRIBED" };
        const subscribeMock = vi.fn().mockReturnValue(fakeSubscription);
        const onMock = vi.fn().mockReturnValue({ subscribe: subscribeMock });
        mockChannel.mockReturnValue({ on: onMock });

        const result = TakeServices.subscribeToTakesUpdates(vi.fn());

        expect(result).toEqual(fakeSubscription);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// loadAllTakesAndTopic
// ─────────────────────────────────────────────────────────────────────────────
describe("TakeServices.loadAllTakesAndTopic", () => {

    const fakeTakes = [
        { take_id: "take-1", message: "Take one", user_id: "uuid-1", topic: "Climate", side: true, Reactions: [] },
        { take_id: "take-2", message: "Take two", user_id: "uuid-2", topic: "Climate", side: false, Reactions: [] },
    ];

    const fakeData = [{ topic: "Climate Change", Takes: fakeTakes }];

    it("returns the topic and takes from the active debate", async () => {
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: fakeData, error: null }),
            }),
        });

        const result = await TakeServices.loadAllTakesAndTopic();

        expect(result).toEqual({
            topic: "Climate Change",
            takes: fakeTakes,
        });
    });

    it("queries the correct table and filters by is_active", async () => {
        const eqMock     = vi.fn().mockResolvedValue({ data: fakeData, error: null });
        const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
        mockFrom.mockReturnValue({ select: selectMock });

        await TakeServices.loadAllTakesAndTopic();

        expect(mockFrom).toHaveBeenCalledWith("Debates");
        expect(eqMock).toHaveBeenCalledWith("is_active", true);
    });

    it("throws a descriptive error when the DB call fails", async () => {
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
            }),
        });

        expect(TakeServices.loadAllTakesAndTopic()).rejects.toThrow(
            "Connection to DB Failed! Could not load all takes! Function: loadAlLTakes()"
        );
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getTopic
// ─────────────────────────────────────────────────────────────────────────────
describe("TakeServices.getTopic", () => {

    it("returns the topic and expiration date from the active debate", async () => {
        const fakeData = [{ topic: "Climate Change", Expiration_Date: "2025-12-31" }];
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: fakeData, error: null }),
            }),
        });

        const result = await TakeServices.getTopic();

        expect(result).toEqual({
            topic: "Climate Change",
            expiration_date: "2025-12-31",
        });
    });

    it("queries the Debates table and filters by is_active", async () => {
        const eqMock     = vi.fn().mockResolvedValue({ data: [{ topic: "T", Expiration_Date: "2025-12-31" }], error: null });
        const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
        mockFrom.mockReturnValue({ select: selectMock });

        await TakeServices.getTopic();

        expect(mockFrom).toHaveBeenCalledWith("Debates");
        expect(eqMock).toHaveBeenCalledWith("is_active", true);
    });

    it("throws a descriptive error when the DB call fails", async () => {
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
            }),
        });

        expect(TakeServices.getTopic()).rejects.toThrow(
            "Connection to DB Failed! Could not load topic! Function: getTopic()"
        );
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// submitNewTake
// ─────────────────────────────────────────────────────────────────────────────
describe("TakeServices.submitNewTake", () => {

    const newTake = {
        message: "This is my take",
        user_id: "uuid-123",
        topic: "Climate Change",
        side: true,
    };

    // Builds the chain for the INSERT into Takes
    function buildInsertChain(takeId: string | null, error: Error | null) {
        return {
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: takeId ? { take_id: takeId } : null,
                        error,
                    }),
                }),
            }),
        };
    }

    // Builds the chain for the UPDATE on Users
    function buildUpdateChain(error: Error | null) {
        return {
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error }),
            }),
        };
    }

    it("resolves without error when both the insert and update succeed", async () => {
        mockFrom
            .mockReturnValueOnce(buildInsertChain("take-abc", null)) // First call: insert into Takes
            .mockReturnValueOnce(buildUpdateChain(null));             // Second call: update Users

        await expect(TakeServices.submitNewTake(newTake)).resolves.toBeUndefined();
    });

    it("inserts into Takes then updates the user's take_id foreign key", async () => {
        mockFrom
            .mockReturnValueOnce(buildInsertChain("take-abc", null))
            .mockReturnValueOnce(buildUpdateChain(null));

        await TakeServices.submitNewTake(newTake);

        expect(mockFrom).toHaveBeenNthCalledWith(1, "Takes");
        expect(mockFrom).toHaveBeenNthCalledWith(2, "Users");
    });

    it("links the correct take_id back to the correct user", async () => {
        const eqMock     = vi.fn().mockResolvedValue({ error: null });
        const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
        mockFrom
            .mockReturnValueOnce(buildInsertChain("take-abc", null))
            .mockReturnValueOnce({ update: updateMock });

        await TakeServices.submitNewTake(newTake);

        expect(updateMock).toHaveBeenCalledWith({ take_id: "take-abc" });
        expect(eqMock).toHaveBeenCalledWith("id", "uuid-123");
    });

    it("throws a descriptive error when the Takes insert fails", async () => {
        mockFrom.mockReturnValueOnce(buildInsertChain(null, new Error("Insert failed")));

        expect(TakeServices.submitNewTake(newTake)).rejects.toThrow(
            "Connection to DB Failed! Could not submit new Take! Function: submitNewTake()"
        );
    });

    it("throws a descriptive error when the Users update fails", async () => {
        mockFrom
            .mockReturnValueOnce(buildInsertChain("take-abc", null))
            .mockReturnValueOnce(buildUpdateChain(new Error("Update failed")));

        expect(TakeServices.submitNewTake(newTake)).rejects.toThrow(
            "DB Failure: Could not link Take to User. Function: submitNewTake()"
        );
    });

    it("does not attempt to update Users if the Takes insert fails", async () => {
        mockFrom.mockReturnValueOnce(buildInsertChain(null, new Error("Insert failed")));

        expect(TakeServices.submitNewTake(newTake)).rejects.toThrow();

        // mockFrom should only have been called once (for Takes), never for Users
        expect(mockFrom).toHaveBeenCalledTimes(1);
    });
});