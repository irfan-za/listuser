import { DashboardClient } from "@/components/DashboardClient";
import { db } from "@/lib/db";
import { users, addresses } from "@/lib/db/schema";
import { eq, ilike, desc } from "drizzle-orm";

async function getUsers(page = 1, firstname = "") {
  const limit = 5;
  const offset = (page - 1) * limit;

  const whereClause = firstname
    ? ilike(users.firstname, `%${firstname}%`)
    : undefined;

  const result = await db
    .select({
      id: users.id,
      firstname: users.firstname,
      lastname: users.lastname,
      birthdate: users.birthdate,
      address: {
        street: addresses.street,
        city: addresses.city,
        province: addresses.province,
        postal_code: addresses.postal_code,
      },
    })
    .from(users)
    .leftJoin(addresses, eq(users.id, addresses.user_id))
    .where(whereClause)
    .orderBy(desc(users.id))
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: users.id })
    .from(users)
    .where(whereClause);

  const total = totalResult.length;
  const totalPages = Math.ceil(total / limit);

  return {
    users: result,
    pagination: {
      page,
      totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page, firstname } = await searchParams;
  const currentPage = page ? Number(page) : 1;
  const currentFirstname = typeof firstname === "string" ? firstname : "";

  const { users, pagination } = await getUsers(currentPage, currentFirstname);

  return (
    <DashboardClient initialUsers={users} initialPagination={pagination} />
  );
}
