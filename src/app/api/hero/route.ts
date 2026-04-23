import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { hero } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const heroId = parseInt(id);
      if (isNaN(heroId)) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(hero)
        .where(eq(hero.id, heroId))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Hero record not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const records = await db.select()
      .from(hero)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, description, imageUrl, availableForWork, cvUrl } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Name is required and must be a non-empty string',
        code: 'INVALID_NAME' 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Title is required and must be a non-empty string',
        code: 'INVALID_TITLE' 
      }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Description is required and must be a non-empty string',
        code: 'INVALID_DESCRIPTION' 
      }, { status: 400 });
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Image URL is required and must be a non-empty string',
        code: 'INVALID_IMAGE_URL' 
      }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    const newRecord = await db.insert(hero)
      .values({
        name: name.trim(),
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        cvUrl: cvUrl ? cvUrl.trim() : null,
        availableForWork: typeof availableForWork === 'boolean' ? availableForWork : true,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const heroId = parseInt(id);

    const existingRecord = await db.select()
      .from(hero)
      .where(eq(hero.id, heroId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Hero record not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, title, description, imageUrl, availableForWork, cvUrl } = body;

    const updates: Partial<{
      name: string;
      title: string;
      description: string;
      imageUrl: string;
      cvUrl: string | null;
      availableForWork: boolean;
      updatedAt: string;
    }> = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Name must be a non-empty string',
          code: 'INVALID_NAME' 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Title must be a non-empty string',
          code: 'INVALID_TITLE' 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Description must be a non-empty string',
          code: 'INVALID_DESCRIPTION' 
        }, { status: 400 });
      }
      updates.description = description.trim();
    }

    if (imageUrl !== undefined) {
      if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Image URL must be a non-empty string',
          code: 'INVALID_IMAGE_URL' 
        }, { status: 400 });
      }
      updates.imageUrl = imageUrl.trim();
    }

    if (availableForWork !== undefined) {
      if (typeof availableForWork !== 'boolean') {
        return NextResponse.json({ 
          error: 'Available for work must be a boolean',
          code: 'INVALID_AVAILABLE_FOR_WORK' 
        }, { status: 400 });
      }
      updates.availableForWork = availableForWork;
    }

    if (cvUrl !== undefined) {
      updates.cvUrl = cvUrl ? cvUrl.trim() : null;
    }

    const updatedRecord = await db.update(hero)
      .set(updates)
      .where(eq(hero.id, heroId))
      .returning();

    return NextResponse.json(updatedRecord[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const heroId = parseInt(id);

    const existingRecord = await db.select()
      .from(hero)
      .where(eq(hero.id, heroId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Hero record not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const deletedRecord = await db.delete(hero)
      .where(eq(hero.id, heroId))
      .returning();

    return NextResponse.json({ 
      message: 'Hero record deleted successfully',
      data: deletedRecord[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}