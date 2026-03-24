import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, ChevronRight, ClipboardList } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AttemptHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const attempts = submissions ?? []

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attempt History</h1>
        <p className="text-zinc-500 mt-2">
          Review your past interview mock attempts and detailed performance reports.
        </p>
      </div>

      <div className="space-y-4">
        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed rounded-lg">
            <ClipboardList className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">No attempts yet</h3>
            <p className="text-zinc-500 mt-1 mb-6">Complete an assessment to see your history here.</p>
            <Link href="/dashboard/assessments">
              <Button>Start an Assessment</Button>
            </Link>
          </div>
        ) : (
          attempts.map((attempt) => (
            <Card key={attempt.id} className="transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg capitalize">{attempt.assessment_type?.replace('-', ' ') ?? 'Assessment'}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(attempt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize text-xs">{attempt.difficulty}</Badge>
                  <Badge
                    variant={attempt.status === 'Completed' ? 'default' : 'secondary'}
                    className={attempt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                  >
                    {attempt.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm mt-2">
                  {attempt.status === 'Completed' && (
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Score: <span className={attempt.score >= 80 ? 'text-emerald-600' : attempt.score >= 50 ? 'text-amber-600' : 'text-red-500'}>{attempt.score}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
              {attempt.status === 'Completed' && (
                <CardFooter className="pt-0 justify-end">
                  <Link href={`/dashboard/report/${attempt.id}`}>
                    <Button variant="ghost" className="hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800">
                      View Detailed Report <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
