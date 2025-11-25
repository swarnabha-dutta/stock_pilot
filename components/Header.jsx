import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropDown from "@/components/UserDropDown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }) => {
    let initialStocks = [];

    try {
        initialStocks = await searchStocks();
    } catch (error) {
        console.error("Failed to load initial stocks for header", error);
    }

    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image
                        src="/assets/icons/logo.png"
                        alt="StockPilot logo"
                        width={420}
                        height={420}
                        className="h-11 w-auto cursor-pointer"
                    />
                </Link>

                <nav className="hidden sm:block">
                    <NavItems initialStocks={initialStocks} />
                </nav>

                <UserDropDown user={user} initialStocks={initialStocks} />
            </div>
        </header>
    );
};

export default Header;
