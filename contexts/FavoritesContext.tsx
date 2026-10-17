"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type FavoritesState = number[];

type FavoritesAction =
  | { type: "SET"; ids: number[] }
  | { type: "ADD"; id: number }
  | { type: "REMOVE"; id: number };

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case "SET":
      return action.ids;
    case "ADD":
      if (state.includes(action.id)) return state;
      return [...state, action.id];
    case "REMOVE":
      return state.filter((id) => id !== action.id);
    default:
      return state;
  }
}

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, []);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET", ids: [] });
      return;
    }

    let isMounted = true;
    supabase
      .from("favorites")
      .select("product_id")
      .then(({ data, error }) => {
        if (!error && data && isMounted) {
          dispatch({ type: "SET", ids: data.map((r: { product_id: number }) => r.product_id) });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const isFavorite = (id: number) => state.includes(id);

  const toggleFavorite = async (id: number) => {
    if (!user) return;

    const has = state.includes(id);
    // Optimistic update
    dispatch({ type: has ? "REMOVE" : "ADD", id });

    const { error } = has
      ? await supabase.from("favorites").delete().eq("product_id", id)
      : await supabase.from("favorites").insert({ product_id: id });

    if (error) {
      // Rollback on error
      dispatch({ type: has ? "ADD" : "REMOVE", id });
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites: state, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
