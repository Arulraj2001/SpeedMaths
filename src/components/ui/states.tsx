import React from "react";
import { Search, Loader2, AlertOctagon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search terms or filters to find what you are looking for.",
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-2xl bg-card/50 backdrop-blur-sm max-w-md mx-auto my-8">
      <div className="p-4 rounded-full bg-secondary text-muted-foreground mb-4">
        {icon || <Search className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading mathematical content..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[250px]">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground animate-pulse font-medium">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error while retrieving this content. Please try again.",
  actionText = "Try Again",
  onAction,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-rose-500/10 rounded-2xl bg-rose-500/5 backdrop-blur-sm max-w-md mx-auto my-8">
      <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4">
        <AlertOctagon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-400 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-500">
          {actionText}
        </Button>
      )}
    </div>
  );
}
