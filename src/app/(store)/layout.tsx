// React
import CategoriesHeader from "@/components/store/layouts/categories-header/categories-header";
import Footer from "@/components/store/layouts/footer/footer";
import Header from "@/components/store/layouts/header/header";
import { ReactNode } from "react";

// Toaster
// import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div>{children}</div>
      {/* <Toaster position="top-center" /> */}
      <Footer />
    </div>
  );
}
