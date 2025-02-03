import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventContextType {
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
  createEvent: (
    eventData: Omit<Event, "id" | "created_at" | "user_id">,
  ) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<Event>;
  loading: boolean;
  error: string | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (
    eventData: Omit<Event, "id" | "created_at" | "user_id">,
  ) => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("events")
        .insert([{ ...eventData, user_id: userData.user.id }])
        .select()
        .single();

      if (error) throw error;
      setCurrentEvent(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setCurrentEvent(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        currentEvent,
        setCurrentEvent,
        createEvent,
        updateEvent,
        loading,
        error,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
