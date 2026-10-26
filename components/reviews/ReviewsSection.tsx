"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { calcAverage } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ReviewsSection({ productId }: { productId: number }) {
  const { user, loading } = useAuth();
  const { reviews, myReview, submitReview, updateReview, deleteReview } =
    useReviews();

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const count = reviews.length;
  const average = calcAverage(reviews);

  const handleSubmit = async (rating: number, comment: string) => {
    const res = await submitReview(rating, comment);
    if (res.ok) {
      setSuccessMessage("Review submitted successfully!");
    }
    return res;
  };

  const handleUpdate = async (rating: number, comment: string) => {
    const res = await updateReview(rating, comment);
    if (res.ok) {
      setIsEditing(false);
      setSuccessMessage("Review updated successfully!");
    }
    return res;
  };

  const handleDelete = async () => {
    await deleteReview();
    setSuccessMessage("");
    setIsEditing(false);
  };

  return (
    <section className="mt-12 border-t pt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Average Rating:{" "}
              <strong data-testid="rating-average" className="text-foreground">
                {average}
              </strong>
              /5
            </span>
            <span>-</span>
            <span>
              <strong data-testid="review-count" className="text-foreground">
                {count}
              </strong>{" "}
              review{count === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {!loading && !user && (
          <Link
            href="/login"
            data-testid="link-login-to-review"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Log in to write a review
          </Link>
        )}
      </div>

      {successMessage && (
        <div
          data-testid="review-success"
          className="mb-6 rounded-md bg-green-50 p-3 text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400"
        >
          {successMessage}
        </div>
      )}

      {!loading && user && (
        <div className="mb-8">
          {myReview && !isEditing ? (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                You have already reviewed this product.
              </p>
            </div>
          ) : isEditing && myReview ? (
            <div>
              <h3 className="text-lg font-semibold mb-3">Edit your review</h3>
              <ReviewForm
                productId={productId}
                initialRating={myReview.rating}
                initialComment={myReview.comment}
                isEditing={true}
                onCancel={() => setIsEditing(false)}
                onSubmitAction={handleUpdate}
              />
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-3">Leave a review</h3>
              <ReviewForm
                productId={productId}
                onSubmitAction={handleSubmit}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div
            data-testid="reviews-empty"
            className="flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((r) => {
            const isMine = user?.id === r.user_id;

            return (
              <div
                key={r.id}
                data-testid="review-item"
                className="rounded-lg border bg-card p-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        data-testid="review-author"
                        className="font-semibold text-foreground"
                      >
                        {r.author}
                      </span>
                      {isMine && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          You
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span>Rating:</span>
                      <span
                        data-testid="review-rating"
                        className="font-bold text-foreground"
                      >
                        {r.rating}
                      </span>
                      <span>/ 5</span>
                    </div>
                  </div>

                  {isMine && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        data-testid="btn-edit-review"
                        onClick={() => {
                          setIsEditing(true);
                          setSuccessMessage("");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        data-testid="btn-delete-review"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                <p
                  data-testid="review-comment"
                  className="mt-3 text-sm leading-relaxed text-foreground"
                >
                  {r.comment}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}