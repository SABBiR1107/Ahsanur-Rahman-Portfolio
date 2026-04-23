import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single skill by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const skill = await db
        .select()
        .from(skills)
        .where(eq(skills.id, parseInt(id)))
        .limit(1);

      if (skill.length === 0) {
        return NextResponse.json(
          { error: 'Skill not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(skill[0], { status: 200 });
    }

    // List all skills with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '200'), 1000);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = db.select().from(skills);

    const conditions = [];

    // Filter by category
    if (category) {
      if (category !== 'hard' && category !== 'soft') {
        return NextResponse.json(
          { error: 'Category must be either "hard" or "soft"', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      conditions.push(eq(skills.category, category));
    }

    // Search by name
    if (search) {
      conditions.push(like(skills.name, `%${search}%`));
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
    const { name, category, proficiency, iconUrl } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Validate category
    if (category !== 'hard' && category !== 'soft' && category !== 'tool') {
      return NextResponse.json(
        { error: 'Category must be "hard", "soft", or "tool"', code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    let proficiencyNum = null;
    if (category !== 'tool') {
      if (proficiency === undefined || proficiency === null) {
        return NextResponse.json(
          { error: 'Proficiency is required for skills', code: 'MISSING_PROFICIENCY' },
          { status: 400 }
        );
      }
      
      // Validate proficiency range (0-100)
      proficiencyNum = parseInt(proficiency);
      if (isNaN(proficiencyNum) || proficiencyNum < 0 || proficiencyNum > 100) {
        return NextResponse.json(
          { error: 'Proficiency must be between 0 and 100', code: 'INVALID_PROFICIENCY' },
          { status: 400 }
        );
      }
    }

    // Create new skill
    const now = new Date().toISOString();
    const newSkill = await db
      .insert(skills)
      .values({
        name: name.trim(),
        category,
        proficiency: proficiencyNum,
        iconUrl: iconUrl ? iconUrl.trim() : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newSkill[0], { status: 201 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, category, proficiency, iconUrl } = body;

    // Validate category if provided
    if (category !== undefined && category !== 'hard' && category !== 'soft' && category !== 'tool') {
      return NextResponse.json(
        { error: 'Category must be "hard", "soft", or "tool"', code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    // Validate proficiency if provided (0-100)
    if (proficiency !== undefined && proficiency !== null) {
      const proficiencyNum = parseInt(proficiency);
      if (isNaN(proficiencyNum) || proficiencyNum < 0 || proficiencyNum > 100) {
        return NextResponse.json(
          { error: 'Proficiency must be between 0 and 100', code: 'INVALID_PROFICIENCY' },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updates: {
      name?: string;
      category?: string;
      proficiency?: number | null;
      iconUrl?: string | null;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (category !== undefined) {
      updates.category = category;
    }

    if (proficiency !== undefined) {
      updates.proficiency = proficiency === null ? null : parseInt(proficiency);
    }

    if (iconUrl !== undefined) {
      updates.iconUrl = iconUrl ? iconUrl.trim() : null;
    }

    // Update skill
    const updatedSkill = await db
      .update(skills)
      .set(updates)
      .where(eq(skills.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedSkill[0], { status: 200 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete skill
    const deletedSkill = await db
      .delete(skills)
      .where(eq(skills.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Skill deleted successfully',
        skill: deletedSkill[0],
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