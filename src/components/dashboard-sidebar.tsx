import { Link } from "react-router";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { PiCalendarCheck, PiSquaresFourLight } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { IoFlagOutline, IoGameControllerOutline } from "react-icons/io5";
import { BiHomeAlt, BiLogOut } from "react-icons/bi";
import { SlKey } from "react-icons/sl"

const items = [
    {
        title: "Dashboard",
        icon: PiSquaresFourLight,
        url: "/dashboard"
    },
    {
        title: "Manajemen Booking",
        icon: LuClipboardList,
        url: "/dashboard/booking"
    },
    {
        title: "Daftar Booking",
        icon: IoFlagOutline,
        url: "/dashboard/daftar"
    },
    {
        title: "Manajemen Cabang",
        icon: BiHomeAlt,
        url: "/dashboard/cabang"
    },
    {
        title: "Manajemen Unit",
        icon: IoGameControllerOutline,
        url: "/dashboard/unit"
    },
    {
        title: "Manajemen Ketersediaan",
        icon: PiCalendarCheck,
        url: "/dashboard/ketersediaan"
    },
    {
        title: "Akses",
        icon: SlKey,
        url: "/dashboard/akses"
    },
]

// < div className = "w-[330px] bg-gradient-to-b from-[#2B0F4A] to-[#3C205D] h-screen" >
//     <div className="py-10 flex flex-col gap-y-10 justify-around h-full">
//         <img src="/logo.svg" alt="logo" className="mx-auto w-[150px]" />
//         <ul className="flex flex-col gap-y-1 text-sm flex-1">
//             <li>
//                 <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white font-bold mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <PiSquaresFourLight size={24} />
//                     <span>Dashboard</span>
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink to="/dashboard/booking" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <LuClipboardList size={24} />
//                     <span>Manajemen Booking</span>
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink to="/dashboard/daftar" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <IoFlagOutline size={24} />
//                     <span>Daftar Booking</span>
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink to="/dashboard/cabang" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <BiHomeAlt size={24} />
//                     <span>Manajemen Cabang</span>
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink to="/dashboard/unit" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <IoGameControllerOutline size={24} />
//                     <span>Manajemen Unit</span>
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink to="/dashboard/ketersediaan" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <PiCalendarCheck size={24} />
//                     <span>Manajemen Ketersediaan</span>
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink to="/dashboard/akses" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                     <SlKey size={24} />
//                     <span>Akses</span>
//                 </NavLink>
//             </li>
//         </ul>
//         <div className="">
//             <NavLink to="/dashboard/logout" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
//                 <BiLogOut size={24} />
//                 <span>Keluar</span>
//             </NavLink>
//         </div>
//     </div>
//             </div >

export function DashboardSidebar() {
    return (
        <Sidebar className="bg-gradient-to-b from-[#2B0F4A] to-[#3C205D]">
            <SidebarHeader>
                <Link to="/dashboard">
                    <img src="/images/logo.svg" alt="logo" className="mx-auto w-[150px]" />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link to={item.url}>
                                    <item.icon size={24} />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter >
                <Link to="/dashboard/logout">
                    <div className="flex gap-x-4 items-center">
                        <BiLogOut size={24} />
                        <span>Keluar</span>
                    </div>
                </Link>
            </SidebarFooter>
        </Sidebar>
    )
}