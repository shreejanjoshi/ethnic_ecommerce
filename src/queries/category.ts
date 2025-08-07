"use server";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// DB
import { db } from "@/lib/db";

// Prisma model
import { type Category } from "@/generated/prisma";

// Function: upsertCategory
// Description: Upserts a category into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.
export const upsertCategory = async (category: Category) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry."
      );

    // Ensure category data is provided
    if (!category) throw new Error("Please provide category data.");

    // Throw error if category with same name or URL already
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    // Throw error if category with same name or URL already exists
    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "A category with the same name already exists";
      } else if (existingCategory.url === category.url) {
        errorMessage = "A category with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert category into the database
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
    });
    return categoryDetails;
  } catch (error) {
    // Log and re-throw any errors
    throw error;
  }
};

// // Function: getAllCategories
// // Description: Retrieves all categories from the database.
// // Permission Level: Public
// // Returns: Array of categories sorted by updatedAt date in descending order.
// export const getAllCategories = async (storeUrl?: string) => {
//   let storeId: string | undefined;

//   if (storeUrl) {
//     // Retrieve the storeId based on the storeUrl
//     const store = await db.store.findUnique({
//       where: { url: storeUrl },
//     });

//     // If no store is found, return an empty array or handle as needed
//     if (!store) {
//       return [];
//     }

//     storeId = store.id;
//   }

//   // Retrieve all categories from the database
//   const categories = await db.category.findMany({
//     where: storeId
//       ? {
//           products: {
//             some: {
//               storeId: storeId,
//             },
//           },
//         }
//       : {},
//     include: {
//       subCategories: true,
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//   });
//   return categories;
// };
export const getAllCategories = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

// Function: getAllCategoriesForCategory
// Description: Retrieves all SubCategories fro a category from the database.
// Permission Level: Public
// Returns: Array of subCategories of category sorted by updatedAt date in descending order.
export const getAllCategoriesForCategory = async (categoryId: string) => {
  // Retrieve all subcategories of category from the database
  const subCategories = await db.subCategory.findMany({
    where: {
      categoryId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Function: getCategory
// Description: Retrieves a specific category from the database.
// Access Level: Public
// Parameters:
//   - categoryId: The ID of the category to be retrieved.
// Returns: Details of the requested category.
export const getCategory = async (categoryId: string) => {
  // Ensure category ID is provided
  if (!categoryId) throw new Error("Please provide category ID.");

  // Retrieve category
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

// Function: deleteCategory
// Description: Deletes a category from the database.
// Permission Level: Admin only
// Parameters:
//   - categoryId: The ID of the category to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteCategory = async (categoryId: string) => {
  // Get current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );

  // Ensure category ID is provided
  if (!categoryId) throw new Error("Please provide category ID.");

  // Delete category from the database
  const response = await db.category.delete({
    where: {
      id: categoryId,
    },
  });
  return response;
};
