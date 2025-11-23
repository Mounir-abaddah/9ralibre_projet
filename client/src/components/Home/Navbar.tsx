import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from '@/assets/images/logo.png'
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
const Navbar = () => {
    const {theme,toggleTheme}=useTheme();
  return (
    <>
        <div className="flex w-full items-center justify-between rounded-md bg-gray-700 p-3 shadow-md">
        <div>
            <img src={logo} alt="logo_9ralibre" width={50}/>
        </div>
        <NavigationMenu>
            <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
                <NavigationMenuLink>Link</NavigationMenuLink>
                <NavigationMenuLink>Link</NavigationMenuLink>
                <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
            </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-3">
            <button className="cursor-pointer rounded-md bg-amber-400 p-2 text-sm font-medium text-black">Inscription</button>
            <button className="cursor-pointer rounded-md bg-cyan-400 p-2 text-sm font-medium text-black">Connexion</button>
            <button
                onClick={toggleTheme}
                className="flex size-10 cursor-pointer items-center justify-center rounded-md border text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                aria-label="Toggle theme"
            >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>
    </div>
    </>
  );
};

export default Navbar;