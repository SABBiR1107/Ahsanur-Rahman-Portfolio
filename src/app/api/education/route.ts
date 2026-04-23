import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { education } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(education)
        .where(eq(education.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Education record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(education);

    if (search) {
      query = query.where(
        or(
          like(education.institution, `%${search}%`),
          like(education.degree, `%${search}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

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
    const { institution, degree, field, startDate, location, endDate, description } = body;

    // Validate required fields
    if (!institution || institution.trim() === '') {
      return NextResponse.json(
        { error: 'Institution is required', code: 'MISSING_INSTITUTION' },
        { status: 400 }
      );
    }

    if (!degree || degree.trim() === '') {
      return NextResponse.json(
        { error: 'Degree is required', code: 'MISSING_DEGREE' },
        { status: 400 }
      );
    }

    if (!field || field.trim() === '') {
      return NextResponse.json(
        { error: 'Field is required', code: 'MISSING_FIELD' },
        { status: 400 }
      );
    }

    if (!startDate || startDate.trim() === '') {
      return NextResponse.json(
        { error: 'Start date is required', code: 'MISSING_START_DATE' },
        { status: 400 }
      );
    }

    if (!location || location.trim() === '') {
      return NextResponse.json(
        { error: 'Location is required', code: 'MISSING_LOCATION' },
        { status: 400 }
      );
    }

    // Create new education record
    const now = new Date().toISOString();
    const newRecord = await db
      .insert(education)
      .values({
        institution: institution.trim(),
        degree: degree.trim(),
        field: field.trim(),
        startDate: startDate.trim(),
        location: location.trim(),
        endDate: endDate ? endDate.trim() : null,
        description: description ? description.trim() : null,
        createdAt: now,
        updatedAt: now,
      })
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
      .from(education)
      .where(eq(education.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Education record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    // Only include fields that are provided in the update
    if (body.institution !== undefined) updates.institution = body.institution.trim();
    if (body.degree !== undefined) updates.degree = body.degree.trim();
    if (body.field !== undefined) updates.field = body.field.trim();
    if (body.startDate !== undefined) updates.startDate = body.startDate.trim();
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.endDate !== undefined) updates.endDate = body.endDate ? body.endDate.trim() : null;
    if (body.description !== undefined) updates.description = body.description ? body.description.trim() : null;

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db
      .update(education)
      .set(updates)
      .where(eq(education.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(education)
      .where(eq(education.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Education record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(education)
      .where(eq(education.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Education record deleted successfully',
        record: deleted[0],
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