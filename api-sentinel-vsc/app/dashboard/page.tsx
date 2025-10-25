// app/dashboard/page.tsx
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import MonitorList from '@/components/MonitorList';
import AddMonitorForm from '@/components/AddMonitorForm';
import { RealtimeMonitorUpdater } from '@/components/RealtimeUpdater';

export const dynamic = 'force-dynamic' // Ensure data is not cached

export default async function DashboardPage() {
  // Server-side check for authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch initial data
  const { data: monitors, error } = await supabase
    .from('monitors')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  // Calculate health summary
  const total = monitors?.length || 0;
  const failed = monitors?.filter(m => m.status >= 400).length || 0;
  const overallHealth = total > 0 ? ((total - failed) / total) * 100 : 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-extrabold mb-8">API Sentinel Dashboard</h1>

      {/* OVERALL HEALTH GAUGE (The WOW factor) */}
      <div className="mb-8 p-6 rounded-2xl shadow-xl transition-all duration-500"
           style={{ backgroundColor: overallHealth === 100 ? '#10B981' : overallHealth > 75 ? '#F59E0B' : '#EF4444' }}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            System Health: {overallHealth.toFixed(0)}%
          </h2>
          <span className="text-5xl">{overallHealth === 100 ? '✅' : overallHealth > 75 ? '⚠️' : '❌'}</span>
        </div>
        <p className="mt-2 text-lg">
          {failed} out of {total} APIs are currently experiencing issues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Active Monitors</h2>
          {/* REAL-TIME UPDATER WRAPPER */}
          <RealtimeMonitorUpdater initialMonitors={monitors || []} userId={user.id}>
            <MonitorList />
          </RealtimeMonitorUpdater>
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Add New Monitor</h2>
          <AddMonitorForm />
        </div>
      </div>
    </div>
  );
}