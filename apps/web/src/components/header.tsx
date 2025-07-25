import { NavLink } from "react-router";

import { ModeToggle } from "./mode-toggle";
import { api } from "@recont/backend/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Header() {
  const healthCheck = useQuery(api.healthCheck.get);
  const links = [
    { to: "/", label: "Home" },
    { to: "/todos", label: "Todos" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-3 py-3">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? "font-bold" : "")}
                end
              >
                {label}
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
        </div>
      </div>
      <hr />
    </div>
  );
}
