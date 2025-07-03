import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="w-100 flex justify-end">
        <ThemeToggle />
      </div>
      <h1 className="text-blue-500 font-barlow">
        Welcome to my ecommerce website
      </h1>
      <Button variant="destructive">click here</Button>
    </div>
  );
}
