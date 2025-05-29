import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, addresses } from "@/lib/db/schema";
import { userSchema } from "@/lib/validations/user";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = parseInt((await params).id);

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
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
    // ts-ignore
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = parseInt((await params).id);
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    await db
      .update(users)
      .set({
        firstname: validatedData.firstname,
        lastname: validatedData.lastname,
        birthdate: validatedData.birthdate,
      })
      .where(eq(users.id, userId));

    await db
      .update(addresses)
      .set({
        street: validatedData.street,
        city: validatedData.city,
        province: validatedData.province,
        postal_code: validatedData.postal_code,
      })
      .where(eq(addresses.user_id, userId));

    return NextResponse.json({ message: "User updated successfully" });
    // ts-ignore
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = parseInt((await params).id);

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ message: "User deleted successfully" });
    // ts-ignore
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
