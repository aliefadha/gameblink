import { SidebarProvider } from "@/components/ui/sidebar"
import { NavLink, Outlet } from "react-router"
import { PiCalendarCheck, PiSquaresFourLight } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { IoFlagOutline, IoGameControllerOutline } from "react-icons/io5";
import { BiHomeAlt, BiLogOut } from "react-icons/bi";
import { SlKey } from "react-icons/sl"

function DashboardLayout() {
    return (
        <SidebarProvider >
            <div className="flex max-h-screen flex-1 overflow-hidden">
                < div className="hidden lg:block w-[330px] bg-gradient-to-b from-[#2B0F4A] to-[#3C205D] h-screen" >
                    <div className="py-10 flex flex-col gap-y-10 justify-around h-full">
                        <img src="/logo.svg" alt="logo" className="mx-auto w-[150px]" />
                        <ul className="flex flex-col gap-y-1 text-sm flex-1">
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <PiSquaresFourLight size={24} />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/booking" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <LuClipboardList size={24} />
                                    <span>Manajemen Booking</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/daftar" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <IoFlagOutline size={24} />
                                    <span>Daftar Booking</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/cabang" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <BiHomeAlt size={24} />
                                    <span>Manajemen Cabang</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/unit" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <IoGameControllerOutline size={24} />
                                    <span>Manajemen Unit</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/ketersediaan" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <PiCalendarCheck size={24} />
                                    <span>Manajemen Ketersediaan</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/akses" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                    <SlKey size={24} />
                                    <span>Akses</span>
                                </NavLink>
                            </li>
                        </ul>
                        <div className="">
                            <NavLink to="/dashboard/logout" className={({ isActive }) => isActive ? 'flex gap-x-4 items-center font-bold mx-4 p-4 rounded-xl bg-white text-[#61368E]' : 'flex gap-x-4 items-center text-white mx-4 p-4 rounded-xl  hover:bg-white hover:text-[#61368E]'} end>
                                <BiLogOut size={24} />
                                <span>Keluar</span>
                            </NavLink>
                        </div>
                    </div>
                </div >

                <div className="w-full overflow-y-auto relative bg-[#F9F4FF]">
                    <header className="bg-white py-4 px-10 sticky top-0">
                        <div className="flex flex-1 justify-end">
                            <h1>Super Admin</h1>
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