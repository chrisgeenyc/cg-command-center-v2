import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const ASANA_BASE = 'https://app.asana.com/api/1.0';

function asanaHeaders() {
  return {
    Authorization: `Bearer ${process.env.ASANA_PAT}`,
    'Content-Type': 'application/json',
  };
}

async function asanaGet(path: string) {
  const res = await fetch(`${ASANA_BASE}${path}`, { headers: asanaHeaders() });
  if (!res.ok) throw new Error(`Asana ${path} → ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('projects_snapshot')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ projects: [], tasks: [] });
  }

  return NextResponse.json({
    projects: (data.data as { projects?: unknown[] }).projects ?? [],
    tasks: (data.data as { projectTasks?: unknown[] }).projectTasks ?? [],
    synced_at: data.synced_at,
  });
}

export async function POST() {
  try {
    const workspaces = await asanaGet('/workspaces');
    if (!workspaces?.length) throw new Error('No Asana workspaces found');
    const wsGid = workspaces[0].gid;

    const rawProjects = await asanaGet(
      `/projects?workspace=${wsGid}&opt_fields=name,notes,due_date,current_status_update,permalink_url&limit=50`
    );

    const projects = Array.isArray(rawProjects) ? rawProjects : [];

    const projectTasks: Record<string, unknown[]> = {};
    await Promise.all(
      projects.slice(0, 10).map(async (p: { gid: string }) => {
        try {
          const tasks = await asanaGet(
            `/tasks?project=${p.gid}&opt_fields=name,assignee.name,due_on,completed&limit=25`
          );
          projectTasks[p.gid] = Array.isArray(tasks) ? tasks : [];
        } catch {
          projectTasks[p.gid] = [];
        }
      })
    );

    const snapshot = { projects, projectTasks };

    const { error } = await supabaseAdmin
      .from('projects_snapshot')
      .insert({ data: snapshot });

    if (error) throw error;

    return NextResponse.json({ ok: true, project_count: projects.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
