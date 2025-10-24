import Link from "next/link";
import Image from "next/image";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if(session?.user) redirect('/')

    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-400 rounded-lg flex items-center justify-center transition-all group-hover:scale-105">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-foreground">Portfolio</span>
                        <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Pulse</span>
                    </span>
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">{children}</div>
            </section>

            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        PortfolioPulse turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
                    </blockquote>
                    <div className="flex items-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">- Ethan R.</cite>
                            <p className="max-md:text-xs text-muted-foreground">Retail Investor</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-yellow-400 text-lg">★</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="auth-dashboard-preview absolute top-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                        <div className="text-center p-8">
                            <div className="text-6xl mb-4">📊</div>
                            <div className="text-2xl font-bold text-white mb-2">PortfolioPulse Dashboard</div>
                            <div className="text-slate-300">Professional market analytics at your fingertips</div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Layout
