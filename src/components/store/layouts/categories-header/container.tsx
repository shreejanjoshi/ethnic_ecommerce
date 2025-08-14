"use client";
import { useState } from "react";
import { type Category, type OfferTag } from "@/generated/prisma";
import CategoriesMenu from "./categories-menu";
import OfferTagsLinks from "./offerTags-links";

export default function CategoriesHeaderContainer({
  categories,
  offerTags,
}: {
  categories: Category[];
  offerTags: OfferTag[];
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      {/* Category menu */}
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />
      {/* Offer tags links */}
      <OfferTagsLinks offerTags={offerTags} open={open} />
    </div>
  );
}
