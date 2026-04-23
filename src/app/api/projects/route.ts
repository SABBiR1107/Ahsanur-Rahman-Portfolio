import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, like, or, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, parseInt(id)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json(
          { error: 'Project not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(project[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '200'), 1000);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let query = db.select().from(projects);
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(projects.title, `%${search}%`),
          like(projects.technologies, `%${search}%`)
        )
      );
    }

    if (featured !== null) {
      if (featured === 'true') {
        conditions.push(eq(projects.featured, true));
      } else if (featured === 'false') {
        conditions.push(eq(projects.featured, false));
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(projects.createdAt))
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
    const { title, description, technologies, imageUrl, githubUrl, liveUrl, featured } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!technologies || !technologies.trim()) {
      return NextResponse.json(
        { error: 'Technologies is required', code: 'MISSING_TECHNOLOGIES' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newProject = await db
      .insert(projects)
      .values({
        title: title.trim(),
        description: description.trim(),
        technologies: technologies.trim(),
        imageUrl: imageUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        liveUrl: liveUrl?.trim() || null,
        featured: featured ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.technologies !== undefined) updates.technologies = body.technologies.trim();
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl?.trim() || null;
    if (body.githubUrl !== undefined) updates.githubUrl = body.githubUrl?.trim() || null;
    if (body.liveUrl !== undefined) updates.liveUrl = body.liveUrl?.trim() || null;
    if (body.featured !== undefined) updates.featured = body.featured;

    const updatedProject = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedProject[0], { status: 200 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Project deleted successfully',
        project: deleted[0],
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