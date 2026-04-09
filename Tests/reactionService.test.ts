import { ReactionService } from "../Services/reactionService";
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

// ─── Mock the Supabase client ────────────────────────────────────────────────
vi.mock("../src/config/supabaseClient.js", () => {
    return {
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
// subscribeToReactionsUpdates
// ─────────────────────────────────────────────────────────────────────────────
describe("ReactionService.subscribeToReactionsUpdates", () => {

    it("calls channel with the correct channel name", () => {
        const subscribeMock = vi.fn().mockReturnValue({ status: "SUBSCRIBED" });
        const onMock        = vi.fn().mockReturnValue({ subscribe: subscribeMock });
        mockChannel.mockReturnValue({ on: onMock });

        ReactionService.subscribeToReactionsUpdates(vi.fn());

        expect(mockChannel).toHaveBeenCalledWith("reaction_updates");
    });

    it("registers a listener for all events (*) on the Reactions table", () => {
        const subscribeMock = vi.fn().mockReturnValue({ status: "SUBSCRIBED" });
        const onMock        = vi.fn().mockReturnValue({ subscribe: subscribeMock });
        mockChannel.mockReturnValue({ on: onMock });

        ReactionService.subscribeToReactionsUpdates(vi.fn());

        expect(onMock).toHaveBeenCalledWith(
            "postgres_changes",
            { event: "*", schema: "public", table: "Reactions" },
            expect.any(Function)
        );
    });

    it("calls assignReactionChange with the updated reaction when a change arrives", () => {
        const assignReactionChange = vi.fn();

        // Capture the callback so we can fire it manually
        let capturedCallback: Function | null = null;
        const subscribeMock = vi.fn();
        const onMock = vi.fn().mockImplementation((_event, _filter, cb) => {
            capturedCallback = cb;
            return { subscribe: subscribeMock };
        });
        mockChannel.mockReturnValue({ on: onMock });

        ReactionService.subscribeToReactionsUpdates(assignReactionChange);

        // Simulate Supabase pushing a reaction change
        const fakePayload = {
            new: {
                user_id: "uuid-123",
                take_id: "take-abc",
                type: "Like",
            },
        };
        capturedCallback!(fakePayload);

        expect(assignReactionChange).toHaveBeenCalledWith({
            user_id: "uuid-123",
            take_id: "take-abc",
            type: "Like",
        });
    });

    it("returns the result of .subscribe()", () => {
        const fakeSubscription = { status: "SUBSCRIBED" };
        const subscribeMock    = vi.fn().mockReturnValue(fakeSubscription);
        const onMock           = vi.fn().mockReturnValue({ subscribe: subscribeMock });
        mockChannel.mockReturnValue({ on: onMock });

        const result = ReactionService.subscribeToReactionsUpdates(vi.fn());

        expect(result).toEqual(fakeSubscription);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// submitNewReaction
// ─────────────────────────────────────────────────────────────────────────────
describe("ReactionService.submitNewReaction", () => {

    const newReaction = {
        user_id: "uuid-123",
        take_id: "take-abc",
        type: "Like" as const,
    };

    it("resolves without error on a successful insert", async () => {
        mockFrom.mockReturnValue({
            insert: vi.fn().mockResolvedValue({ error: null }),
        });

        await expect(ReactionService.submitNewReaction(newReaction)).resolves.toBeUndefined();
    });

    it("inserts into the correct table with the correct reaction", async () => {
        const insertMock = vi.fn().mockResolvedValue({ error: null });
        mockFrom.mockReturnValue({ insert: insertMock });

        await ReactionService.submitNewReaction(newReaction);

        expect(mockFrom).toHaveBeenCalledWith("Reactions");
        expect(insertMock).toHaveBeenCalledWith(newReaction);
    });

    it("throws a descriptive error when the insert fails", async () => {
        mockFrom.mockReturnValue({
            insert: vi.fn().mockResolvedValue({ error: new Error("Insert failed") }),
        });

        expect(ReactionService.submitNewReaction(newReaction)).rejects.toThrow(
            "Connection to DB Failed! Could not submit new Reaction! Function: submitNewReaction()"
        );
    });

    it("handles all valid reaction types without error", async () => {
        const types = ["Like", "Dislike", "None"] as const;

        for (const type of types) {
            mockFrom.mockReturnValue({
                insert: vi.fn().mockResolvedValue({ error: null }),
            });

            await expect(
                ReactionService.submitNewReaction({ ...newReaction, type })
            ).resolves.toBeUndefined();
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// updateReaction
// ─────────────────────────────────────────────────────────────────────────────
describe("ReactionService.updateReaction", () => {

    const updatedReaction = {
        user_id: "uuid-123",
        take_id: "take-abc",
        type: "Dislike" as const,
    };

    // Builds the full update chain with two .eq() calls
    function buildUpdateChain(error: Error | null) {
        const eqTakeMock = vi.fn().mockResolvedValue({ error });
        const eqUserMock = vi.fn().mockReturnValue({ eq: eqTakeMock });
        const updateMock = vi.fn().mockReturnValue({ eq: eqUserMock });
        return { updateMock, eqUserMock, eqTakeMock };
    }

    it("resolves without error on a successful update", async () => {
        const { updateMock } = buildUpdateChain(null);
        mockFrom.mockReturnValue({ update: updateMock });

        await expect(ReactionService.updateReaction(updatedReaction)).resolves.toBeUndefined();
    });

    it("updates the correct table with the correct type", async () => {
        const { updateMock } = buildUpdateChain(null);
        mockFrom.mockReturnValue({ update: updateMock });

        await ReactionService.updateReaction(updatedReaction);

        expect(mockFrom).toHaveBeenCalledWith("Reactions");
        expect(updateMock).toHaveBeenCalledWith({ type: "Dislike" });
    });

    it("filters by both user_id and take_id", async () => {
        const { updateMock, eqUserMock, eqTakeMock } = buildUpdateChain(null);
        mockFrom.mockReturnValue({ update: updateMock });

        await ReactionService.updateReaction(updatedReaction);

        expect(eqUserMock).toHaveBeenCalledWith("user_id", "uuid-123");
        expect(eqTakeMock).toHaveBeenCalledWith("take_id", "take-abc");
    });

    it("throws a descriptive error when the update fails", async () => {
        const { updateMock } = buildUpdateChain(new Error("Update failed"));
        mockFrom.mockReturnValue({ update: updateMock });

        expect(ReactionService.updateReaction(updatedReaction)).rejects.toThrow(
            "Connection to DB Failed! Could not update Reaction! Function: updateReaction()"
        );
    });

    it("handles all valid reaction types without error", async () => {
        const types = ["Like", "Dislike", "None"] as const;

        for (const type of types) {
            const { updateMock } = buildUpdateChain(null);
            mockFrom.mockReturnValue({ update: updateMock });

            await expect(
                ReactionService.updateReaction({ ...updatedReaction, type })
            ).resolves.toBeUndefined();
        }
    });
});