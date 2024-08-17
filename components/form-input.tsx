import React, { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import FormErrors from "./form-errors";

type FormInputProps = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  errors?: Record<string, string[] | undefined>;
  name: string
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      className,
      defaultValue = "",
      disabled,
      onBlur,
      placeholder,
      required,
      type,
      errors,
      name,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          <Input
            onBlur={onBlur}
            ref={ref}
            required={required}
            id={id}
            placeholder={placeholder}
            type={type}
            disabled={pending || disabled}
            className={cn("text-sm ", className)}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
            name={name}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
export default FormInput;
