import countries from "@/data/countries.json";
import { db } from "@/lib/db";
export async function seedCountries() {
  try {
    for (const country of countries) {
      await db.country.upsert({
        where: {
          name: country.name,
        },
        create: {
          name: country.name,
          code: country.code,
        },
        update: {
          name: country.name,
          code: country.code,
        },
      });
    }
    console.log("success");
  } catch (error) {
    console.log("error");
  }
}
