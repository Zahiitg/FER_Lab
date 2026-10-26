"use client";

import React, { createContext, useContext, useReducer } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import type { Review } from "@/lib/reviews";

type Action =
  | { type: "SET"; reviews: Review[] }
  | { type: "ADD"; review: Review }
  | { type: "UPDATE"; review: Review }
  | { type: "REMOVE"; id: number };

const byNewest = (a: Review, b: Review) =>
  b.created_at.localeCompare(a.created_at);

function reducer(state: Review[], action: Action): Review[] {
  switch (action.type) {
    case "SET":
      return action.reviews;
    case "ADD":
      return [...state.filter((r) => r.id !== action.review.id), action.review].sort(
        byNewest
      );
    case "UPDATE":
      return state.map((r) => (r.id === action.review.id ? action.review : r));
    case "REMOVE":
      return state.filter((r) => r.id !== action.id);
    default:
      return state;
  }
}

interface ReviewsContextType {
  reviews: Review[];
  myReview: Review | undefined;
  submitReview: (
    rating: number,
    comment: string
  ) => Promise<{ ok: boolean; error?: string }>;
  updateReview: (
    rating: number,
    comment: string
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteReview: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({
  productId,
  initialReviews,
  children,
}: {
  productId: number;
  initialReviews: Review[];
  children: React.ReactNode;
}) {
  const [reviews, dispatch] = useReducer(reducer, initialReviews);
  const { user } = useAuth();
  const router = useRouter();

  const myReview = user
    ? reviews.find((r) => r.user_id === user.id)
    : undefined;

  const submitReview = async (rating: number, comment: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { ok: false, error: "Please log in" };
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ product_id: productId, rating, comment }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error ?? "Something went wrong" };
    }

    dispatch({ type: "ADD", review: json as Review });
    router.refresh();
    return { ok: true };
  };

  const updateReview = async (rating: number, comment: string) => {
    if (!myReview) return { ok: false, error: "No review" };

    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", myReview.id)
      .select("id, user_id, product_id, rating, comment, author, created_at")
      .single();

    if (error) return { ok: false, error: error.message };

    dispatch({ type: "UPDATE", review: data as Review });
    router.refresh();
    return { ok: true };
  };

  const deleteReview = async () => {
    if (!myReview) return;
    const backup = myReview;
    dispatch({ type: "REMOVE", id: backup.id }); // optimistic

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", backup.id);

    if (error) {
      dispatch({ type: "ADD", review: backup }); // rollback
    } else {
      router.refresh();
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        myReview,
        submitReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
