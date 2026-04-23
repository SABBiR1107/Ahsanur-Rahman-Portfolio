import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { certificates } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single certificate by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const certificate = await db
        .select()
        .from(certificates)
        .where(eq(certificates.id, parseInt(id)))
        .limit(1);

      if (certificate.length === 0) {
        return NextResponse.json(
          { error: 'Certificate not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(certificate[0], { status: 200 });
    }

    // List all certificates with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(certificates);

    if (search) {
      query = query.where(
        or(
          like(certificates.title, `%${search}%`),
          like(certificates.issuer, `%${search}%`)
        )
      );
    }

    const results = await query
      .orderBy(desc(certificates.issueDate))
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
    const { title, issuer, issueDate, credentialUrl, description } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!issuer || typeof issuer !== 'string' || issuer.trim() === '') {
      return NextResponse.json(
        { error: 'Issuer is required and must be a non-empty string', code: 'MISSING_ISSUER' },
        { status: 400 }
      );
    }

    if (!issueDate || typeof issueDate !== 'string' || issueDate.trim() === '') {
      return NextResponse.json(
        { error: 'Issue date is required and must be a non-empty string', code: 'MISSING_ISSUE_DATE' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newCertificate = await db
      .insert(certificates)
      .values({
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate.trim(),
        credentialUrl: credentialUrl ? credentialUrl.trim() : null,
        description: description ? description.trim() : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newCertificate[0], { status: 201 });
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

    // Check if certificate exists
    const existing = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Certificate not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, issuer, issueDate, credentialUrl, description } = body;

    // Build update object with only provided fields
    const updates: Record<string, string | null> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (issuer !== undefined) {
      if (typeof issuer !== 'string' || issuer.trim() === '') {
        return NextResponse.json(
          { error: 'Issuer must be a non-empty string', code: 'INVALID_ISSUER' },
          { status: 400 }
        );
      }
      updates.issuer = issuer.trim();
    }

    if (issueDate !== undefined) {
      if (typeof issueDate !== 'string' || issueDate.trim() === '') {
        return NextResponse.json(
          { error: 'Issue date must be a non-empty string', code: 'INVALID_ISSUE_DATE' },
          { status: 400 }
        );
      }
      updates.issueDate = issueDate.trim();
    }

    if (credentialUrl !== undefined) {
      updates.credentialUrl = credentialUrl ? credentialUrl.trim() : null;
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : null;
    }

    const updated = await db
      .update(certificates)
      .set(updates)
      .where(eq(certificates.id, parseInt(id)))
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

    // Check if certificate exists
    const existing = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Certificate not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(certificates)
      .where(eq(certificates.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Certificate deleted successfully',
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