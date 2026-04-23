import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { experience } from '@/db/schema';
import { eq, like, or, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(experience)
        .where(eq(experience.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Experience record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const currentFilter = searchParams.get('current');

    let query = db.select().from(experience);

    // Build conditions array
    const conditions = [];

    // Search across company and position
    if (search) {
      conditions.push(
        or(
          like(experience.company, `%${search}%`),
          like(experience.position, `%${search}%`)
        )
      );
    }

    // Filter by current position
    if (currentFilter !== null) {
      const isCurrentValue = currentFilter === 'true';
      conditions.push(eq(experience.current, isCurrentValue));
    }

    // Apply all conditions if any exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sort by startDate descending and apply pagination
    const results = await query
      .orderBy(desc(experience.startDate))
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
    const { company, position, startDate, location, endDate, description, current } = body;

    // Validate required fields
    if (!company || !company.trim()) {
      return NextResponse.json(
        { error: 'Company is required', code: 'MISSING_COMPANY' },
        { status: 400 }
      );
    }

    if (!position || !position.trim()) {
      return NextResponse.json(
        { error: 'Position is required', code: 'MISSING_POSITION' },
        { status: 400 }
      );
    }

    if (!startDate || !startDate.trim()) {
      return NextResponse.json(
        { error: 'Start date is required', code: 'MISSING_START_DATE' },
        { status: 400 }
      );
    }

    if (!location || !location.trim()) {
      return NextResponse.json(
        { error: 'Location is required', code: 'MISSING_LOCATION' },
        { status: 400 }
      );
    }

    // Prepare insert data with auto-generated fields
    const now = new Date().toISOString();
    const insertData = {
      company: company.trim(),
      position: position.trim(),
      startDate: startDate.trim(),
      location: location.trim(),
      endDate: endDate?.trim() || null,
      description: description?.trim() || null,
      current: current ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const newRecord = await db
      .insert(experience)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
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

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(experience)
      .where(eq(experience.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Experience record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    // Build update object with only provided fields
    if (body.company !== undefined) updates.company = body.company.trim();
    if (body.position !== undefined) updates.position = body.position.trim();
    if (body.startDate !== undefined) updates.startDate = body.startDate.trim();
    if (body.endDate !== undefined) updates.endDate = body.endDate ? body.endDate.trim() : null;
    if (body.description !== undefined) updates.description = body.description ? body.description.trim() : null;
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.current !== undefined) updates.current = body.current;

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updatedRecord = await db
      .update(experience)
      .set(updates)
      .where(eq(experience.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedRecord[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
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

    // Check if record exists before deleting
    const existingRecord = await db
      .select()
      .from(experience)
      .where(eq(experience.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Experience record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedRecord = await db
      .delete(experience)
      .where(eq(experience.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Experience record deleted successfully',
        deletedRecord: deletedRecord[0],
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