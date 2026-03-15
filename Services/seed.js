import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ngukguvinzmbnnhngctr.supabase.co', '')

const dummyUsers = [
    { email: 'tester1@test.com', username: 'DebateMaster' },
    { email: 'tester2@test.com', username: 'LogicWizard' },
    { email: 'tester3@test.com', username: 'TheSkeptic' }
]

async function seed() {

    for (const user of dummyUsers) {
        // 1. Create the user in Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: 'password123',
            email_confirm: true // This skips the email verification step!
        })

        if (authError) {
            console.error(`Error creating ${user.email}:`, authError.message)
            console.error(`Error creating ${user.email}:`, authError)
            continue
        }

        // 2. Insert into your public table
        const { error: profileError } = await supabase
            .from('Users')
            .insert({ id: authUser.user.id, Username: user.username })

        if (profileError) console.log("Profile Error:", profileError.message)
        else console.log(`Successfully seeded: ${user.username}`)
    }
}

seed().then(r => console.log(r))