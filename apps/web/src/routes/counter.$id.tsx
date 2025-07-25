import { useMutation, useQuery } from "convex/react";
import type { Route } from "./+types/counter.$id";
import { api } from "@recont/backend/convex/_generated/api";
import type { Id } from "@recont/backend/convex/_generated/dataModel";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { EditIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function CounterDetail({ params }: Route.ComponentProps) {
  const id = params.id as Id<"counters">;
  const navigation = useNavigate();

  const counter = useQuery(api.counters.getOne, { id });
  const [editName, setEditName] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  const set = useMutation(api.counters.set).withOptimisticUpdate(
    (localStore, args) => {
      const { count } = args;
      const currentCounters = localStore.getQuery(api.counters.getOne, { id });

      if (!currentCounters) return;
      currentCounters.count = count;

      localStore.setQuery(api.counters.getOne, { id }, currentCounters);
    }
  );
  const counterDelete = useMutation(api.counters.deleteCounter);
  const rename = useMutation(api.counters.rename).withOptimisticUpdate(
    (localStore, args) => {
      const { name } = args;
      const currentCounter = localStore.getQuery(api.counters.getOne, { id });

      if (!currentCounter) return;
      currentCounter.name = name;

      localStore.setQuery(api.counters.getOne, { id }, currentCounter);
    }
  );

  const handleCountClick = async (
    action: "increment" | "decrement" | "reset"
  ) => {
    if (!counter) return;

    switch (action) {
      case "increment":
        await set({ id, count: counter.count + 1 });
        break;
      case "decrement":
        await set({ id, count: counter.count - 1 });
        break;
      case "reset":
        await set({ id, count: 0 });
        break;
    }
  };

  const handleCounterDelete = async () => {
    if (!counter) return;
    counterDelete({ id });

    navigation("/");
  };

  const handleCounterRename = async (newName: string) => {
    if (!counter) return;
    await rename({ id, name: newName });
  };

  const handleEditingClick = () => {
    setEditing(true);
    setEditName(counter ? counter.name : "");
  };

  return (
    <div className="px-4 justify-center container mx-auto py-4 flex flex-col gap-4">
      <div className="relative flex justify-center">
        <div onClick={handleEditingClick}>
          {editing ? (
            <Input
              key="edit-value"
              className="md:text-2xl shadow-none text-2xl font-display font-bold text-center bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => {
                if (!editName.trim()) {
                  setEditing(false);
                  return;
                }

                handleCounterRename(editName);
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCounterRename(editName);
                  setEditing(false);
                }
              }}
              autoFocus
            />
          ) : (
            <Input
              key="real-value"
              disabled
              className="w-min md:text-2xl disabled:opacity-100 disabled:cursor-pointer shadow-none text-2xl font-display font-bold text-center bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={counter ? counter.name : "Loading..."}
              onClick={handleEditingClick}
            />
          )}
        </div>

        {!editing && (
          <div className="absolute right-0 top-0 flex gap-4">
            <Button variant="outline" size="icon" onClick={handleEditingClick}>
              <EditIcon className="text-muted-foreground h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCounterDelete}>
              <TrashIcon className="text-destructive h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {counter ? (
        <p className="text-[200px] text-center font-display my-auto">
          {counter.count}
        </p>
      ) : (
        <Loader />
      )}
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="destructive"
          size="xl"
          onClick={() => handleCountClick("decrement")}
        >
          <MinusIcon />1
        </Button>
        <Button
          variant="outline"
          size="xl"
          onClick={() => handleCountClick("reset")}
        >
          Reset
        </Button>
        <Button
          variant="default"
          size="xl"
          onClick={() => handleCountClick("increment")}
        >
          <PlusIcon />1
        </Button>
      </div>
    </div>
  );
}
