import { Link, NavLink, Outlet } from "react-router"
import { PiCalendarCheck, PiSquaresFourLight } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { IoFlagOutline, IoGameControllerOutline } from "react-icons/io5";
import { BiHomeAlt, BiLogOut } from "react-icons/bi";
import { SlKey } from "react-icons/sl"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
    { to: "/dashboard", icon: PiSquaresFourLight, label: "Dashboard" },
    { to: "/dashboard/booking", icon: LuClipboardList, label: "List Booking" },
    { to: "/dashboard/daftar-booking", icon: IoFlagOutline, label: "Manage Booking" },
    { to: "/dashboard/cabang", icon: BiHomeAlt, label: "Manage Cabang" },
    { to: "/dashboard/unit", icon: IoGameControllerOutline, label: "Manajemen Unit" },
    { to: "/dashboard/ketersediaan", icon: PiCalendarCheck, label: "Manage Slot" },
    { to: "/dashboard/akses", icon: SlKey, label: "Akses" },
];

function DashboardLayout() {
    const { user, logout } = useAuth();
    const filteredMenuItems = menuItems.filter(item => {
        if (user?.role === 'ADMIN') {
            return [
                '/dashboard/booking',
                '/dashboard/daftar-booking'
            ].includes(item.to);
        }
        return true;
    });
    return (
        <SidebarProvider>
            <div className="flex max-h-screen flex-1 overflow-hidden">
                <Sidebar className="bg-gradient-to-b from-[#2B0F4A] to-[#3C205D] h-screen">
                    <SidebarHeader className="py-6">
                        <Link to="/dashboard">
                            <img src="/images/logo.svg" alt="logo" className="mx-auto w-[120px]" />
                        </Link>
                    </SidebarHeader>
                    <SidebarContent className="flex flex-col gap-y-0.5 text-xs flex-1 py-0">
                        <SidebarMenu>
                            {filteredMenuItems.map((item) => (
                                <SidebarMenuItem key={item.to}>
                                    <NavLink to={item.to} className={({ isActive }) => isActive ? 'flex gap-x-3 items-center font-bold mx-3 p-3 rounded-lg bg-white text-[#61368E]' : 'flex gap-x-3 items-center text-white mx-3 p-3 rounded-lg  hover:bg-white hover:text-[#61368E]'} end>
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <button
                            onClick={logout}
                            className="flex w-full text-left gap-x-3 items-center text-white mx-3 p-3 rounded-lg hover:text-zinc-700"
                        >
                            <BiLogOut size={20} />
                            <span>Keluar</span>
                        </button>
                    </SidebarFooter>
                </Sidebar>

                <div className="w-full overflow-y-auto relative bg-[#F9F4FF]">
                    <header className="bg-white py-4 px-10 sticky top-0 flex items-center">
                        <SidebarTrigger className="mr-4" />
                        <div className="flex flex-1 justify-end">
                            <h1>{user?.name}</h1>
                        </div>
                    </header>
                    <div>
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout