'use client'

import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SearchCommand from "@/components/SearchCommand";

const NavItems = ({initialStocks, userEmail}: { initialStocks: StockWithWatchlistStatus[], userEmail?: string}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-1 sm:gap-2 font-medium">
            {NAV_ITEMS.map(({ href, label }) => {
                if(href === '/search') return (
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                            userEmail={userEmail}
                        />
                    </li>
                )

                return <li key={href}>
                    <Link href={href} className={`px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                        isActive(href) ? 'bg-accent text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                    }`}>
                        {label}
                    </Link>
                </li>
            })}
        </ul>
    )
}
export default NavItems
