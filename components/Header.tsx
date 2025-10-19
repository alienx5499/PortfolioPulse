import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    // Load stocks with error handling
    let initialStocks: StockWithWatchlistStatus[] = [];
    try {
        initialStocks = await searchStocks();
    } catch (error) {
        console.error('Failed to load stocks:', error);
    }

    return (
        <header className="dashboard-header">
            <div className="dashboard-nav container">
        <Link href="/" className="flex items-center gap-3 group">
            {/* Professional logo */}
            <Image 
                src="/assets/icons/portfoliopulse-icon.svg" 
                alt="PortfolioPulse" 
                width={40} 
                height={40}
                className="transition-all group-hover:scale-105"
            />
            {/* Text logo */}
            <span className="text-xl font-bold text-foreground">
                PortfolioPulse
            </span>
        </Link>
                <nav className="hidden sm:block">
                    <NavItems initialStocks={initialStocks} userEmail={user.email} />
                </nav>

                <UserDropdown user={user} initialStocks={initialStocks} />
            </div>
        </header>
    )
}
export default Header
