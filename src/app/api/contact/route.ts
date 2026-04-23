import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contact } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(contact)
        .where(eq(contact.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Contact record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db
      .select()
      .from(contact)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, location, github, linkedin, twitter, facebook, instagram, youtube, discord, website } = body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required and must not be empty', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingContact = await db
      .select()
      .from(contact)
      .where(eq(contact.email, trimmedEmail))
      .limit(1);

    if (existingContact.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'DUPLICATE_EMAIL' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newContact = await db
      .insert(contact)
      .values({
        email: trimmedEmail,
        phone: phone?.trim() || null,
        location: location?.trim() || null,
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
        twitter: twitter?.trim() || null,
        facebook: facebook?.trim() || null,
        instagram: instagram?.trim() || null,
        youtube: youtube?.trim() || null,
        discord: discord?.trim() || null,
        website: website?.trim() || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newContact[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'DUPLICATE_EMAIL' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingRecord = await db
      .select()
      .from(contact)
      .where(eq(contact.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Contact record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { email, phone, location, github, linkedin, twitter, facebook, instagram, youtube, discord, website } = body;

    const updates: Record<string, string | null> = {
      updatedAt: new Date().toISOString(),
    };

    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim() === '') {
        return NextResponse.json(
          { error: 'Email must not be empty', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }

      const trimmedEmail = email.trim().toLowerCase();

      if (trimmedEmail !== existingRecord[0].email) {
        const duplicateCheck = await db
          .select()
          .from(contact)
          .where(eq(contact.email, trimmedEmail))
          .limit(1);

        if (duplicateCheck.length > 0) {
          return NextResponse.json(
            { error: 'Email already exists', code: 'DUPLICATE_EMAIL' },
            { status: 400 }
          );
        }
      }

      updates.email = trimmedEmail;
    }

    if (phone !== undefined) updates.phone = phone?.trim() || null;
    if (location !== undefined) updates.location = location?.trim() || null;
    if (github !== undefined) updates.github = github?.trim() || null;
    if (linkedin !== undefined) updates.linkedin = linkedin?.trim() || null;
    if (twitter !== undefined) updates.twitter = twitter?.trim() || null;
    if (facebook !== undefined) updates.facebook = facebook?.trim() || null;
    if (instagram !== undefined) updates.instagram = instagram?.trim() || null;
    if (youtube !== undefined) updates.youtube = youtube?.trim() || null;
    if (discord !== undefined) updates.discord = discord?.trim() || null;
    if (website !== undefined) updates.website = website?.trim() || null;

    const updated = await db
      .update(contact)
      .set(updates)
      .where(eq(contact.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);

    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'DUPLICATE_EMAIL' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingRecord = await db
      .select()
      .from(contact)
      .where(eq(contact.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Contact record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(contact)
      .where(eq(contact.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Contact record deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}