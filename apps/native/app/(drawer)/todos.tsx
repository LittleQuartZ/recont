import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@recont/backend/convex/_generated/api";
import type { Id } from "@recont/backend/convex/_generated/dataModel";

import { Container } from "@/components/container";

export default function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");

  const todos = useQuery(api.todos.getAll);
  const createTodoMutation = useMutation(api.todos.create);
  const toggleTodoMutation = useMutation(api.todos.toggle);
  const deleteTodoMutation = useMutation(api.todos.deleteTodo);

  const handleAddTodo = async () => {
    const text = newTodoText.trim();
    if (!text) return;
    await createTodoMutation({ text });
    setNewTodoText("");
  };

  const handleToggleTodo = (id: Id<"todos">, currentCompleted: boolean) => {
    toggleTodoMutation({ id, completed: !currentCompleted });
  };

  const handleDeleteTodo = (id: Id<"todos">) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodoMutation({ id }),
      },
    ]);
  };

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <View className="mb-6 rounded-lg border border-border p-4 bg-card">
            <Text className="text-foreground text-2xl font-bold mb-2">
              Todo List
            </Text>
            <Text className="text-muted-foreground mb-4">
              Manage your tasks efficiently
            </Text>

            <View className="mb-6">
              <View className="flex-row items-center space-x-2 mb-2">
                <TextInput
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  placeholder="Add a new task..."
                  placeholderTextColor="#6b7280"
                  className="flex-1 border border-border rounded-md px-3 py-2 text-foreground bg-background"
                  onSubmitEditing={handleAddTodo}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={handleAddTodo}
                  disabled={!newTodoText.trim()}
                  className={`px-4 py-2 rounded-md ${
                    !newTodoText.trim()
                      ? "bg-muted"
                      : "bg-primary"
                  }`}
                >
                  <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {todos === undefined ? (
              <View className="flex justify-center py-8">
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : todos.length === 0 ? (
              <Text className="py-8 text-center text-muted-foreground">
                No todos yet. Add one above!
              </Text>
            ) : (
              <View className="space-y-2">
                {todos.map((todo) => (
                  <View
                    key={todo._id}
                    className="flex-row items-center justify-between rounded-md border border-border p-3 bg-background"
                  >
                    <View className="flex-row items-center flex-1">
                      <TouchableOpacity
                        onPress={() =>
                          handleToggleTodo(todo._id, todo.completed)
                        }
                        className="mr-3"
                      >
                        <Ionicons
                          name={todo.completed ? "checkbox" : "square-outline"}
                          size={24}
                          color={todo.completed ? "#22c55e" : "#6b7280"}
                        />
                      </TouchableOpacity>
                      <Text
                        className={`flex-1 ${
                          todo.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {todo.text}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteTodo(todo._id)}
                      className="ml-2 p-1"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
