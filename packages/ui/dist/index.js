// src/components/button.tsx
import * as React from "react";
import { cva } from "class-variance-authority";

// ../shared/src/index.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/button.tsx
import { jsx } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// src/components/card.tsx
import * as React2 from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var Card = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/components/dialog.tsx
import * as React3 from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var Dialog = React3.forwardRef(
  ({ className, open, onOpenChange, ...props }, ref) => {
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        className: cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          className
        ),
        ...props
      }
    );
  }
);
Dialog.displayName = "Dialog";
var DialogContent = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn(
      "relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
      className
    ),
    ...props
  }
));
DialogContent.displayName = "DialogContent";
var DialogHeader = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "div",
  {
    ref,
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
));
DialogHeader.displayName = "DialogHeader";
var DialogTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "h2",
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = "DialogTitle";
var DialogDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx3(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = "DialogDescription";

// src/components/form.tsx
import * as React4 from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var Form = React4.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx4("form", { ref, className: cn("space-y-4", className), ...props })
);
Form.displayName = "Form";
var FormField = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4("div", { ref, className: cn("space-y-2", className), ...props }));
FormField.displayName = "FormField";
var FormLabel = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  "label",
  {
    ref,
    className: cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    ),
    ...props
  }
));
FormLabel.displayName = "FormLabel";
var FormControl = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4("div", { ref, className: cn("", className), ...props }));
FormControl.displayName = "FormControl";
var FormMessage = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  "p",
  {
    ref,
    className: cn("text-sm font-medium text-destructive", className),
    ...props
  }
));
FormMessage.displayName = "FormMessage";

// src/components/input.tsx
import * as React5 from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Input = React5.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx5(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

// src/components/label.tsx
import * as React6 from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var Label = React6.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
    "label",
    {
      ref,
      className: cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      ),
      ...props
    }
  )
);
Label.displayName = "Label";
export {
  Button,
  Card,
  Dialog,
  Form,
  Input,
  Label
};
//# sourceMappingURL=index.js.map