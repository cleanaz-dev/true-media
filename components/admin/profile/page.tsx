import { getUserById } from "@/lib/actions/get-user-by-id"
import { getCurrentUser } from "@/lib/actions/get-user-session"
import { redirect } from "next/navigation"

export default async function Page() {

    const session = await getCurrentUser()

    if(!session) {
        redirect('/sign-in')
    }

    const user = await getUserById(session.id)

    return (
        <div>
            Profile Page
        </div>
    )
}