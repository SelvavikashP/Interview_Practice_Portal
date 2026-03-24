import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'

// Mock Data
const ATTEMPTS = [
  { id: '1', role: 'Full Stack Developer', date: '2023-10-24T10:00:00Z', type: 'Full Mock Interview', score: 85, status: 'Completed' },
  { id: '2', role: 'Full Stack Developer', date: '2023-10-23T15:30:00Z', type: 'Coding Round', score: 92, status: 'Completed' },
  { id: '3', role: 'Full Stack Developer', date: '2023-10-20T11:15:00Z', type: 'Aptitude & Technical MCQ', score: 78, status: 'Completed' },
  { id: '4', role: 'Full Stack Developer', date: '2023-10-18T09:00:00Z', type: 'HR & Technical AI Interview', score: 0, status: 'Incomplete' },
]

export default function AttemptHistoryPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attempt History</h1>
        <p className="text-zinc-500 mt-2">
          Review your past interview mock attempts and detailed performance reports.
        </p>
      </div>

      <div className="space-y-4">
        {ATTEMPTS.map((attempt) => (
          <Card key={attempt.id} className="transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-lg">{attempt.type}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(attempt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </div>
              <Badge variant={attempt.status === 'Completed' ? 'default' : 'secondary'} className={attempt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}>
                {attempt.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm mt-2">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Target Role: <span className="font-normal text-zinc-500">{attempt.role}</span>
                </div>
                {attempt.status === 'Completed' && (
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Overall Score: <span className={attempt.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{attempt.score}%</span>
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
        ))}
      </div>
    </div>
  )
}
