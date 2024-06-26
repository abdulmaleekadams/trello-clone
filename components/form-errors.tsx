import { XCircle } from "lucide-react";

type FormErrorsProps = {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

const FormErrors = ({ id, errors }: FormErrorsProps) => {
  if (!errors) return null;

  return (
    <div
      aria-live="polite"
      className="mt-2 text-xs text-rose-500"
      id={`${id}-error`}
    >
      {errors?.[id]?.map((error: string) => (
        <div
          key={error}
          className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm"
        >
          <XCircle className="mr-2 w-4 h-4" />
          {error}
        </div>
      ))}
    </div>
  );
};

export default FormErrors;
