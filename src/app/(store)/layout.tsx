// React
import Header from "@/components/dashboard/store/layouts/header/header";
import { ReactNode } from "react";

// Toaster
// import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      {/* <Toaster position="top-center" /> */}
    </div>
  );
}
