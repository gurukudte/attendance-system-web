import { Loader2 } from "lucide-react"; // Using shadcn/ui's Loader2 icon
import { PulseLoader } from "react-spinners"; // Using react-spinners for the animation
import { cn } from "@/lib/utils"; // Assuming you have a utility function for classNames

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Loader = ({
  size = 24,
  color = "#000000",
  className,
}: LoaderProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <PulseLoader size={size} color={color} />
      {/* Alternatively, you can use shadcn/ui's Loader2 icon */}
      {/* <Loader2 className="animate-spin" size={size} color={color} /> */}
    </div>
  );
};
