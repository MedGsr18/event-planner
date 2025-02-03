import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Guest = Database["public"]["Tables"]["guests"]["Row"];
type BudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
type Vendor = Database["public"]["Tables"]["vendors"]["Row"];

export const useEvents = (eventId?: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("event_id", eventId);

        if (tasksError) throw tasksError;
        setTasks(tasksData);

        // Fetch guests
        const { data: guestsData, error: guestsError } = await supabase
          .from("guests")
          .select("*")
          .eq("event_id", eventId);

        if (guestsError) throw guestsError;
        setGuests(guestsData);

        // Fetch budget items
        const { data: budgetData, error: budgetError } = await supabase
          .from("budget_items")
          .select("*")
          .eq("event_id", eventId);

        if (budgetError) throw budgetError;
        setBudgetItems(budgetData);

        // Fetch vendors
        const { data: vendorsData, error: vendorsError } = await supabase
          .from("vendors")
          .select("*")
          .eq("event_id", eventId);

        if (vendorsError) throw vendorsError;
        setVendors(vendorsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscriptions
    const tasksSubscription = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          fetchEventData();
        },
      )
      .subscribe();

    const guestsSubscription = supabase
      .channel("guests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          fetchEventData();
        },
      )
      .subscribe();

    const budgetSubscription = supabase
      .channel("budget-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budget_items",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          fetchEventData();
        },
      )
      .subscribe();

    fetchEventData();

    return () => {
      tasksSubscription.unsubscribe();
      guestsSubscription.unsubscribe();
      budgetSubscription.unsubscribe();
    };
  }, [eventId]);

  const createTask = async (taskData: Omit<Task, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const createGuest = async (guestData: Omit<Guest, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("guests")
      .insert([guestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    const { data, error } = await supabase
      .from("guests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const createBudgetItem = async (
    itemData: Omit<BudgetItem, "id" | "created_at">,
  ) => {
    const { data, error } = await supabase
      .from("budget_items")
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    const { data, error } = await supabase
      .from("budget_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return {
    event,
    tasks,
    guests,
    budgetItems,
    vendors,
    loading,
    error,
    createTask,
    updateTask,
    createGuest,
    updateGuest,
    createBudgetItem,
    updateBudgetItem,
  };
};
