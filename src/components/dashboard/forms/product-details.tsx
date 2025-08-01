"use client";

// React, Next.js
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import { type Category, type Store } from "@/generated/prisma";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { ProductFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../shared/image-upload";
import { useToast } from "@/components/ui/use-toast";

// Queries
import { upsertStore } from "@/queries/store";

// Utils
import { v4 } from "uuid";

// Types
import { ProductWithVariantType } from "@/lib/types";

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  storeUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ProductFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      description: data?.description,
      variantName: data?.variantName,
      variantDescription: data?.variantDescription,
      images: data?.images || [],
      // variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
      categoryId: data?.categoryId,
      // offerTagId: data?.offerTagId,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand,
      sku: data?.sku,
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      // product_specs: data?.product_specs,
      // variant_specs: data?.variant_specs,
      keywords: data?.keywords,
      // questions: data?.questions,
      isSale: data?.isSale || false,
      // weight: data?.weight,
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      // Upserting category data
      const response = await upsertStore({
        id: data?.id ? data.id : v4(),
        name: values.name,
        description: values.description,
        email: values.email,
        phone: values.phone,
        logo: values.logo[0].url,
        cover: values.cover[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Displaying success message
      toast({
        title: data?.id
          ? "Store has been updated."
          : `Congratulations! Store is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores`);
      }
    } catch (error: any) {
      // Handling form submission errors
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data?.name} product information.`
              : "Lets create a product. You can edit product later from the product page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              // @ts-ignore
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Images - Color */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  // @ts-ignore
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          dontShowPreview
                          type="standard"
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
              {/* Name */}
              <FormField
                readOnly={isLoading}
                // @ts-ignore
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                readOnly={isLoading}
                // @ts-ignore
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email - Phone */}
              {/* <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  readOnly={isLoading}
                  // @ts-ignore
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  readOnly={isLoading}
                  // @ts-ignore
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                readOnly={isLoading}
                // @ts-ignore
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store url</FormLabel>
                    <FormControl>
                      <Input placeholder="/store-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // @ts-ignore
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This Store will appear on the home page.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              /> */}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.productId && data.variantId
                  ? "Save product information"
                  : "Create product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
