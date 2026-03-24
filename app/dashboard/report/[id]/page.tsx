import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { ScoreChart } from '@/components/dashboard/score-chart'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ReportPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // Fetch this specific submission, scoped to the logged-in user
  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!submission) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">Report Not Found</h1>
        <p className="text-zinc-500">This report does not exist or you do not have access to it.</p>
        <Link href="/dashboard/history">
          <Button>Back to History</Button>
        </Link>
      </div>
    )
  }

  const report = submission.report || {}
  const overallScore = submission.score ?? 0
  const readiness = overallScore >= 80 ? 'Interview Ready' : overallScore >= 50 ? 'Needs Practice' : 'Not Ready'

  const roundScores = report.roundScores || [
    { name: submission.assessment_type?.replace('-', ' ') || 'Assessment', score: overallScore },
  ]

  const strengths = report.strengths || ['Complete more assessments to see detailed strengths']
  const weaknesses = report.weaknesses || ['Complete more assessments to see areas for improvement']
  const feedback = report.feedback || `You scored ${overallScore}% on this ${submission.assessment_type?.replace('-', ' ')} assessment at ${submission.difficulty} difficulty. Keep practicing to improve your scores!`

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Assessment Report</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 capitalize">
              {submission.assessment_type?.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs">{submission.difficulty}</Badge>
          </div>
          <p className="text-zinc-500">
            Completed on {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Badge className={submission.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
          {submission.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Readiness Score Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-100">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-6xl font-extrabold mb-2">{overallScore}%</div>
            <div className="text-lg font-medium bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
              {readiness}
            </div>
          </CardContent>
        </Card>

        {/* Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Round-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart data={roundScores} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weaknesses.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{feedback}</p>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8 pt-8">
        <Link href="/dashboard/assessments">
          <Button size="lg">
            Take Another Assessment <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
