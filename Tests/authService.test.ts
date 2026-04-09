import { AuthService } from "../Services/authService";
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

// ─── Mock the Supabase client ────────────────────────────────────────────────
// We mock the entire module so no real network calls are ever made.
vi.mock("../src/config/supabaseClient.js", () => ({
    default: {
        auth: {
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            getUser: vi.fn(),
            getSession: vi.fn(),
        },
        rpc: vi.fn(),
    },
}));

import supabase from "../src/config/supabaseClient.js";

// Typed references to each mocked method for convenience
const mockSignUp            = supabase.auth.signUp            as Mock;
const mockSignIn            = supabase.auth.signInWithPassword as Mock;
const mockSignOut           = supabase.auth.signOut            as Mock;
const mockGetUser           = supabase.auth.getUser            as Mock;
const mockGetSession        = supabase.auth.getSession         as Mock;
const mockRpc               = supabase.rpc                     as Mock;

// Clear call history between tests so they don't bleed into each other
beforeEach(() => vi.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────
// registerAccount
// ─────────────────────────────────────────────────────────────────────────────
describe("AuthService.registerAccount", () => {

    it("returns true when sign-up and RPC both succeed", async () => {
        mockSignUp.mockResolvedValue({
            data: { user: { id: "uuid-123" } },
            error: null,
        });
        mockRpc.mockResolvedValue({ error: null });

        const result = await AuthService.registerAccount("alice", "alice@example.com", "password123");

        expect(result).toBe(true);
    });

    it("calls signUp with the correct email and password", async () => {
        mockSignUp.mockResolvedValue({
            data: { user: { id: "uuid-123" } },
            error: null,
        });
        mockRpc.mockResolvedValue({ error: null });

        await AuthService.registerAccount("alice", "alice@example.com", "password123");

        expect(mockSignUp).toHaveBeenCalledWith({
            email: "alice@example.com",
            password: "password123",
            options: {
                data: {
                    display_name: "alice"
                }
            }
        });
    });

    it("calls the initialize_user_profile RPC with correct args", async () => {
        mockSignUp.mockResolvedValue({
            data: { user: { id: "uuid-123" } },
            error: null,
        });
        mockRpc.mockResolvedValue({ error: null });

        await AuthService.registerAccount("alice", "alice@example.com", "password123");

        expect(mockRpc).toHaveBeenCalledWith("initialize_user_profile", {
            user_id: "uuid-123",
            username_input: "alice",
        });
    });

    it("throws when signUp returns an error", async () => {
        const authError = new Error("Email already in use");
        mockSignUp.mockResolvedValue({ data: {user: {id: "uuid-123" }}, error: authError });


        expect(
            AuthService.registerAccount("alice", "alice@example.com", "password123")
        ).rejects.toThrow("Email already in use");
    });

    it("throws when the RPC returns an error", async () => {
        mockSignUp.mockResolvedValue({
            data: { user: { id: "uuid-123" } },
            error: null,
        });
        const rpcError = new Error("Username already taken");
        mockRpc.mockResolvedValue({ error: rpcError });

        expect(
            AuthService.registerAccount("alice", "alice@example.com", "password123")
        ).rejects.toThrow("Username already taken");
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// login
// ─────────────────────────────────────────────────────────────────────────────
describe("AuthService.login", () => {

    it("returns true on successful login", async () => {
        mockSignIn.mockResolvedValue({
            data: { user: { id: "uuid-123" }, session: {} },
            error: null,
        });

        const result = await AuthService.login("alice@example.com", "password123");

        expect(result).toBe(true);
    });

    it("calls signInWithPassword with the correct credentials", async () => {
        mockSignIn.mockResolvedValue({
            data: { user: { id: "uuid-123" }, session: {} },
            error: null,
        });

        await AuthService.login("alice@example.com", "password123");

        expect(mockSignIn).toHaveBeenCalledWith({
            email: "alice@example.com",
            password: "password123",
        });
    });

    it("throws when login fails", async () => {
        const loginError = new Error("Invalid credentials");
        mockSignIn.mockResolvedValue({ data: null, error: loginError });

        await expect(
            AuthService.login("alice@example.com", "wrongpassword")
        ).rejects.toThrow("Invalid credentials");
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// logout
// ─────────────────────────────────────────────────────────────────────────────
describe("AuthService.logout", () => {

    it("resolves without error on successful logout", async () => {
        mockSignOut.mockResolvedValue({ error: null });

        await expect(AuthService.logout()).resolves.toBeUndefined();
        expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it("throws when signOut returns an error", async () => {
        const signOutError = new Error("Sign-out failed");
        mockSignOut.mockResolvedValue({ error: signOutError });

        await expect(AuthService.logout()).rejects.toThrow("Sign-out failed");
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// isLoggedIn
// ─────────────────────────────────────────────────────────────────────────────
describe("AuthService.isLoggedIn", () => {

    it("returns true when a user is present", async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: "uuid-123" } },
            error: null,
        });

        const result = await AuthService.isLoggedIn();

        expect(result).toBe(true);
    });

    it("returns false when getUser returns an error", async () => {
        mockGetUser.mockResolvedValue({
            data: null,
            error: new Error("Not authenticated"),
        });

        const result = await AuthService.isLoggedIn();

        expect(result).toBe(false);
    });

    it("returns false when data is null (no active session)", async () => {
        mockGetUser.mockResolvedValue({ data: null, error: null });

        const result = await AuthService.isLoggedIn();

        expect(result).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserSession
// ─────────────────────────────────────────────────────────────────────────────
describe("AuthService.getUserSession", () => {

    it("returns the session object on success", async () => {
        const fakeSession = { access_token: "token-abc", user: { id: "uuid-123" } };
        mockGetSession.mockResolvedValue({
            data: { session: fakeSession },
            error: null,
        });

        const session = await AuthService.getUserSession();

        expect(session).toEqual(fakeSession);
    });

    it("returns null when there is no active session", async () => {
        mockGetSession.mockResolvedValue({
            data: { session: null },
            error: null,
        });

        const session = await AuthService.getUserSession();

        expect(session).toBeNull();
    });

    it("throws when getSession returns an error", async () => {
        const sessionError = new Error("Session retrieval failed");
        mockGetSession.mockResolvedValue({ data: null, error: sessionError });

        await expect(AuthService.getUserSession()).rejects.toThrow(
            "Session retrieval failed"
        );
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserId
// ─────────────────────────────────────────────────────────────────────────────
describe("AuthService.getUserId", () => {

    it("returns the user's UUID on success", async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: "uuid-123" } },
            error: null,
        });

        const id = await AuthService.getUserId();

        expect(id).toBe("uuid-123");
    });

    it("throws when getUser returns an error", async () => {
        const userError = new Error("User not found");
        mockGetUser.mockResolvedValue({ data: null, error: userError });

        await expect(AuthService.getUserId()).rejects.toThrow("User not found");
    });
});