import type { Route } from "./+types/_index";
import { useMutation, useQuery } from "convex/react";
import { api } from "@recont/backend/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Id } from "@recont/backend/convex/_generated/dataModel";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "recont" },
    {
      name: "description",
      content: "recont is a web application for counting things",
    },
  ];
}

export default function Home() {
  const counters = useQuery(api.counters.getAll);
  const [newCounterName, setNewCounterName] = useState("");

  const createCounter = useMutation(api.counters.create);

  const handleAddCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCounterName.trim();
    if (!name) return;
    await createCounter({ name });
    setNewCounterName("");
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <form onSubmit={handleAddCounter} className="flex">
        <Input
          placeholder="new counter name"
          value={newCounterName}
          onChange={(e) => setNewCounterName(e.target.value)}
        />
        <Button
          type="submit"
          disabled={!newCounterName.trim()}
          className="ml-2"
        >
          Create
        </Button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        {counters?.map((counter) => (
          <CounterCard
            key={counter._id}
            id={counter._id}
            name={counter.name}
            count={counter.count}
          />
        ))}
      </div>
    </div>
  );
}

function CounterCard({
  id,
  name,
  count,
}: {
  id: Id<"counters">;
  name: string;
  count: number;
}) {
  const set = useMutation(api.counters.set).withOptimisticUpdate(
    (localStore, args) => {
      const { count } = args;
      const currentCounters = localStore.getQuery(api.counters.getAll);

      localStore.setQuery(
        api.counters.getAll,
        {},
        currentCounters?.map((counter) => {
          if (counter._id === id) {
            return { ...counter, count };
          }
          return counter;
        })
      );
    }
  );

  const handleCountClick = async (
    action: "increment" | "decrement" | "reset"
  ) => {
    switch (action) {
      case "increment":
        await set({ id, count: count + 1 });
        break;
      case "decrement":
        await set({ id, count: count - 1 });
        break;
      case "reset":
        await set({ id, count: 0 });
        break;
    }
  };

  return (
    <Card className="group shadow-none pb-0 overflow-hidden">
      <NavLink to={`/counter/${id}`} className="flex flex-col gap-6">
        <h1 className="text-2xl font-display font-bold text-center">{name}</h1>
        <p className="text-9xl text-center font-display">{count}</p>
      </NavLink>
      <div className="opacity-0 transition group-hover:opacity-100 grid grid-cols-3">
        <Button
          variant="destructive"
          size="lg"
          className="rounded-none"
          onClick={() => handleCountClick("decrement")}
        >
          Decrement
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-none"
          onClick={() => handleCountClick("reset")}
        >
          Reset
        </Button>
        <Button
          variant="default"
          size="lg"
          className="rounded-none"
          onClick={() => handleCountClick("increment")}
        >
          Increment
        </Button>
      </div>
    </Card>
  );
}
