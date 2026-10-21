import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const STYLES = {
  // Login and signup sit on a permanently dark shader.
  auth: {
    label: "text-brand-mist",
    input:
      "bg-brand-mist/10 text-brand-mist ring-brand-mist/25 placeholder:text-brand-mist/50 focus:ring-brand-lime/70 aria-invalid:ring-brand-coral/80 [color-scheme:dark]",
    error: "text-brand-coral",
    hint: "text-brand-mist/70",
    toggle:
      "text-brand-mist/70 hover:bg-brand-mist/15 hover:text-brand-mist focus-visible:outline-brand-lime",
  },
  // Inside the app, follows the light/dark toggle.
  themed: {
    label: "text-foreground",
    input:
      "bg-card/60 text-foreground ring-border placeholder:text-muted-foreground focus:ring-ring aria-invalid:ring-destructive [color-scheme:light] dark:[color-scheme:dark]",
    error: "text-destructive",
    hint: "text-muted-foreground",
    toggle:
      "text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-ring",
  },
} as const;

type AuthFieldProps = Omit<ComponentProps<"input">, "className"> & {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  variant?: keyof typeof STYLES;
};

export function AuthField({
  label, error, hint, type = "text", className, id, variant = "auth", ...props
}: AuthFieldProps) {
  const s = STYLES[variant];
  const uid = useId();
  const inputId = id ?? uid;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className={cn("text-sm font-semibold", s.label)}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && shown ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-xl px-3 py-2.5 text-base ring-1 outline-none focus:ring-2 aria-invalid:ring-2",
            s.input,
            isPassword && "pr-11",
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? "Hide password" : "Show password"}
            className={cn(
              "absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2",
              s.toggle,
            )}
          >
            {shown ? <EyeSlash size={18} weight="bold" aria-hidden /> : <Eye size={18} weight="bold" aria-hidden />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className={cn("text-sm font-semibold", s.error)}>{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className={cn("text-xs", s.hint)}>{hint}</p>
      ) : null}
    </div>
  );
}