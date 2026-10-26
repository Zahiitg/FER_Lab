"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/lib/reviewSchema";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  productId: number;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
  onCancel?: () => void;
  onSubmitAction: (
    rating: number,
    comment: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

export default function ReviewForm({
  productId,
  initialRating,
  initialComment = "",
  isEditing = false,
  onCancel,
  onSubmitAction,
}: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_id: productId,
      rating: initialRating,
      comment: initialComment,
    },
  });

  const onSubmit = async (data: ReviewInput) => {
    const res = await onSubmitAction(data.rating, data.comment);
    if (!res.ok) {
      setError("root.serverError", {
        type: "server",
        message: res.error || "Failed to submit review",
      });
    }
  };

  const serverError = errors.root?.serverError?.message;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-testid="review-form"
      className="space-y-4 rounded-lg border bg-card p-4 shadow-xs"
    >
      <div className="space-y-1.5">
        <label htmlFor="review-rating" className="text-sm font-medium">
          Rating
        </label>
        <select
          id="review-rating"
          {...register("rating", { valueAsNumber: true })}
          data-testid="input-rating"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        {errors.rating && (
          <p data-testid="error-rating" className="text-sm text-destructive">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-comment" className="text-sm font-medium">
          Comment
        </label>
        <textarea
          id="review-comment"
          rows={3}
          placeholder="Share your thoughts about this product..."
          {...register("comment")}
          data-testid="input-comment"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {errors.comment && (
          <p data-testid="error-comment" className="text-sm text-destructive">
            {errors.comment.message}
          </p>
        )}
      </div>

      {serverError && (
        <p data-testid="error-review" className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          data-testid="btn-submit-review"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </Button>
        {isEditing && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
