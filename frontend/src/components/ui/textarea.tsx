import * as React from "react";

import { cn } from "../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, onChange, style, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const resize = React.useCallback(() => {
      if (!autoResize || !innerRef.current) return;

      innerRef.current.style.height = "0px";
      innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
    }, [autoResize]);

    React.useLayoutEffect(() => {
      resize();
    }, [props.value, resize]);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm leading-6 ring-offset-background transition-[border-color,box-shadow,height] duration-200 placeholder:text-muted-foreground/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/10 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
          autoResize && "resize-none overflow-hidden",
          className,
        )}
        onChange={(event) => {
          onChange?.(event);
          resize();
        }}
        ref={setRefs}
        style={{
          ...style,
          height: autoResize ? style?.height : undefined,
        }}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
