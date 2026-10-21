import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// The auth pages sit on a permanently dark shader, so these fields use the
// brand tokens that never flip with the light/dark toggle. This keeps them
// light-on-dark like the login page, without hard-coding hex values.
const inputClass =
  "w-full rounded-xl bg-brand-mist/10 px-3 py-2.5 text-base text-brand-mist ring-1 ring-brand-mist/25 outline-none placeholder:text-brand-mist/50 focus:ring-2 focus:ring-brand-lime/70 aria-invalid:ring-2 aria-invalid:ring-brand-coral/80 [color-scheme:dark]";

type AuthFieldProps = Omit<ComponentProps<"input">, "className"> & {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function AuthField({
  label,
  error,
  hint,
  type = "text",
  className,
  id,
  ...props
}: AuthFieldProps) {
  const uid = useId();
  const inputId = id ?? uid;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-brand-mist">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && shown ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(inputClass, isPassword && "pr-11")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full text-brand-mist/70 hover:bg-brand-mist/15 hover:text-brand-mist focus-visible:outline-2 focus-visible:outline-brand-lime"
          >
            {shown ? (
              <EyeSlash size={18} weight="bold" aria-hidden />
            ) : (
              <Eye size={18} weight="bold" aria-hidden />
            )}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-sm font-semibold text-brand-coral">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-brand-mist/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
}