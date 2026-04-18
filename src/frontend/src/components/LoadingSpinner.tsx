interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const SIZE_MAP = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export default function LoadingSpinner({
  size = "md",
  text,
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      data-ocid="loading_spinner.loading_state"
    >
      <div
        className={`${SIZE_MAP[size]} border-primary border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
