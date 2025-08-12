import ThemeToggle from "@/components/shared/theme-toggle";
// import { seedCountries } from "@/migration-scripts/seed-countries";
// import { updateVariantImage } from "@/migration-scripts/migrate-variantImage";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  // await updateVariantImage();
  // await seedCountries();
  return (
    <div>
      <div className="w-100 flex gap-x-5 justify-end">
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className="text-blue-500 font-barlow">Home page</h1>
    </div>
  );
}
