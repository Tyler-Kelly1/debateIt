import {describe, test, expect, afterAll, beforeAll} from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { AuthService } from "../Services/authService"
import { TakeServices } from "../Services/takesService"
import 'dotenv/config'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)


const testUsers = () =>{

    const accum = [];
    for (let i = 0; i < 400; i++) {
        accum.push({ username: `user${i}`, email: `tester${i}@gmail.com`, password: '12345678' })
    }

    return accum
}

const testReplies = () =>{

    const accum = [];
    for (let i = 0; i < 600; i++) {
        accum.push({ newReply: 'lol', userId: 'd7640ab6-a066-4d60-8832-f1a1cc0e48fa', takeId: '92b49f50-6f48-4c14-af5d-7e3f141c198a' })
    }

    return accum
}

describe('User Creation', () => {
    const createdUserIds: string[] = []

    test('Test database storage', async () => {
        for (const user of testUsers()) {
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

describe('Reply Creation', () => {
    const createdReplyIds: string[] = []

    beforeAll(async () => {
        await AuthService.login('tester@gmail.com', '12345678')
    })

    test('Test database storage', async () => {
        for (const reply of testReplies()) {
            const {success, id} = await TakeServices.submitNewReply(reply.newReply, reply.userId, reply.takeId)
            createdReplyIds.push(id)
            expect(success).toBe(true)
        }
    })

    afterAll(async () => {
        for (const id of createdReplyIds) {
            const { error } = await supabase
                .from('Replies')
                .delete()
                .eq('reply_id', id)
            if (error) throw error
        }
        await AuthService.logout()
    })
})