import { NavLink } from "react-router";

import { ModeToggle } from "./mode-toggle";
import { api } from "@recont/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { HomeIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Header() {
  const auth = useUser();
  const healthCheck = useQuery(api.healthCheck.get);
  const links = [{ to: "/", icon: <HomeIcon /> }];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-3 py-3">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, icon }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  buttonVariants({
                    variant: isActive ? "default" : "outline",
                    size: "icon",
                  })
                }
                end
              >
                {icon}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}`}
            />
            <span className="text-sm text-muted-foreground">
              {healthCheck === undefined
                ? "Checking..."
                : healthCheck === "OK"
                  ? "Connected"
                  : "Error"}
            </span>
          </div>
          <ModeToggle />
          <Avatar className="rounded">
            <AvatarImage src={auth.user?.imageUrl} />
            <AvatarFallback>
              {auth.user?.firstName?.charAt(0) ||
                auth.user?.lastName?.charAt(0) ||
                "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <hr />
    </div>
  );
}
