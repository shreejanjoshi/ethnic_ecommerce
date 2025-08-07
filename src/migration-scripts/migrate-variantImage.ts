"use server";

import { db } from "@/lib/db";

export async function updateVariantImage() {
  try {
    // Fetch all product variants that have images
    const variants = await db.productVariant.findMany({
      include: {
        images: true,
      },
    });

    // Update each variant with the first image URL
    for (const variant of variants) {
      if (variant.images.length > 0) {
        const firstImage = variant.images[0];
        await db.productVariant.update({
          where: { id: variant.id },
          data: {
            variantImage: firstImage.url,
          },
        });
      }
    }
  } catch (error) {}
}
