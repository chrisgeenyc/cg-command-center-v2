import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Unified task shape across Asana + HubSpot, classified into
// Eisenhower quadrants:
//   do       — urgent + important
//   schedule — important, not urgent
//   delegate — urgent, not important
//   later    — neither

export interface UnifiedTask {
  id: string;
  title: string;
  source: 'asana' | 'hubspot';
  project: string | null;
  due: string | null;
  priority: string | null;
  quadrant: 'do' | 'schedule' | 'delegate' | 'later';
}

interface AsanaTask {
  gid: string;
  name: string;
  completed: boolean;
  due_on?: string;
  assignee?: { name?: string };
}

interface AsanaProject {
  gid: string;
  name: string;
  due_date?: string;
}

interface HubSpotTask {
  id: string;
  properties: {
    hs_task_subject?: string;
    hs_task_priority?: string;
    hs_timestamp?: string;
    hs_task_status?: string;
    hs_task_type?: string;
  };
}

const DAY = 86400000;

// Urgent = overdue or due within 2 days
function isUrgent(due: string | null): boolean {
  if (!due) return false;
  const t = new Date(due).getTime();
  if (Number.isNaN(t)) return false;
  return t <= Date.now() + 2 * DAY;
}

function quadrant(urgent: boolean, important: boolean): UnifiedTask['quadrant'] {
  if (urgent && important) return 'do';
  if (!urgent && important) return 'schedule';
  if (urgent && !important) return 'delegate';
  return 'later';
}

export async function GET() {
  try {
    const [projectsRes, pipelineRes] = await Promise.all([
      supabaseAdmin
        .from('projects_snapshot')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from('pipeline_snapshot')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single(),
    ]);

    const tasks: UnifiedTask[] = [];

    // ── Asana ────────────────────────────────────────────────────────────
    // Important = the parent project has a deadline within 21 days.
    if (projectsRes.data) {
      const snap = projectsRes.data.data as {
        projects?: AsanaProject[];
        projectTasks?: Record<string, AsanaTask[]>;
      };
      const projects = snap.projects ?? [];
      const projectTasks = snap.projectTasks ?? {};

      for (const p of projects) {
        const projDue = p.due_date ? new Date(p.due_date).getTime() : null;
        const important =
          projDue != null && !Number.isNaN(projDue) && projDue <= Date.now() + 21 * DAY;

        for (const t of projectTasks[p.gid] ?? []) {
          if (t.completed) continue;
          const due = t.due_on ?? null;
          tasks.push({
            id: `asana-${t.gid}`,
            title: t.name,
            source: 'asana',
            project: p.name,
            due,
            priority: null,
            quadrant: quadrant(isUrgent(due), important),
          });
        }
      }
    }

    // ── HubSpot ──────────────────────────────────────────────────────────
    // Important = priority HIGH or MEDIUM.
    if (pipelineRes.data) {
      const snap = pipelineRes.data.data as { tasks?: HubSpotTask[] };
      for (const t of snap.tasks ?? []) {
        const props = t.properties ?? {};
        if (props.hs_task_status === 'COMPLETED') continue;
        const due = props.hs_timestamp ?? null;
        const pri = props.hs_task_priority ?? null;
        const important = pri === 'HIGH' || pri === 'MEDIUM';
        tasks.push({
          id: `hubspot-${t.id}`,
          title: props.hs_task_subject ?? 'Untitled task',
          source: 'hubspot',
          project: null,
          due,
          priority: pri,
          quadrant: quadrant(isUrgent(due), important),
        });
      }
    }

    // Soonest due first within the full list; undated tasks sink to the bottom
    tasks.sort((a, b) => {
      const ta = a.due ? new Date(a.due).getTime() : Infinity;
      const tb = b.due ? new Date(b.due).getTime() : Infinity;
      return ta - tb;
    });

    return NextResponse.json({
      tasks,
      counts: {
        do: tasks.filter(t => t.quadrant === 'do').length,
        schedule: tasks.filter(t => t.quadrant === 'schedule').length,
        delegate: tasks.filter(t => t.quadrant === 'delegate').length,
        later: tasks.filter(t => t.quadrant === 'later').length,
      },
      synced_at: projectsRes.data?.synced_at ?? pipelineRes.data?.synced_at ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ tasks: [], counts: { do: 0, schedule: 0, delegate: 0, later: 0 }, error: msg });
  }
}
