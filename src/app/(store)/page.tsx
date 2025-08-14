import ThemeToggle from "@/components/shared/theme-toggle";
import ProductList from "@/components/store/shared/product-list";
// import { seedCountries } from "@/migration-scripts/seed-countries";
// import { updateVariantImage } from "@/migration-scripts/migrate-variantImage";
import { UserButton } from "@clerk/nextjs";
import { getProducts } from "@/queries/product";

export default async function HomePage() {
  const productsData = await getProducts({}, "", 1, 100);
  const { products } = productsData;
  return (
    <div>
      <div className="w-100 flex gap-x-5 justify-end">
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className="text-blue-500 font-barlow">Home page</h1>
      <ProductList products={products} title="Products" arrow />
    </div>
  );
}
