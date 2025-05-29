import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, addresses } from "@/lib/db/schema";
import { userSchema } from "@/lib/validations/user";
import { eq, ilike, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = 5;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? ilike(users.firstname, `%${search}%`)
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

    return NextResponse.json({
      users: result,
      pagination: {
        page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    const [newUser] = await db
      .insert(users)
      .values({
        firstname: validatedData.firstname,
        lastname: validatedData.lastname,
        birthdate: validatedData.birthdate,
      })
      .returning();

    await db.insert(addresses).values({
      user_id: newUser.id,
      street: validatedData.street,
      city: validatedData.city,
      province: validatedData.province,
      postal_code: validatedData.postal_code,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
