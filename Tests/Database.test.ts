import { describe, test, expect, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { AuthService } from "../Services/authService"
import 'dotenv/config'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

const testUsers = [
    { username: 'user1', email: 'tester1@gmail.com', password: '12345678' },
    { username: 'user2', email: 'tester2@gmail.com', password: '12345678' },
    { username: 'user3', email: 'tester3@gmail.com', password: '12345678' },
    { username: 'user4', email: 'tester4@gmail.com', password: '12345678' },
    { username: 'user5', email: 'tester5@gmail.com', password: '12345678' }
]

describe('User Creation', () => {
    const createdUserIds: string[] = []

    test('Test database storage', async () => {
        for (const user of testUsers) {
            const result = await AuthService.registerAccount(user.username, user.email, user.password)
            createdUserIds.push(await AuthService.getUserId())
            expect(result).toBe(true)
        }
    })

    afterAll(async () => {
        for (const id of createdUserIds) {
            await supabase.auth.admin.deleteUser(id)
        }
    })
})