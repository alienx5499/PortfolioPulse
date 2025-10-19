import { Suspense } from "react";
import Header from "@/components/Header";
import Loader from "@/components/ui/loader-11";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if(!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }

    return (
        <main className="min-h-screen bg-background">
            <Header user={user} />

            <Suspense fallback={
                <div className="container py-6 flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader />
                        <p className="text-muted-foreground text-sm">Loading page...</p>
                    </div>
                </div>
            }>
                <div className="container py-6">
                    {children}
                </div>
            </Suspense>
        </main>
    )
}
export default Layout
