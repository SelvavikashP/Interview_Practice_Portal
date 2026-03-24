import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { ScoreChart } from '@/components/dashboard/score-chart'
import Link from 'next/link'

// Mock Detailed Report Data
const REPORT = {
  id: '1',
  role: 'Full Stack Developer',
  date: '2023-10-24T10:00:00Z',
  type: 'Full Mock Interview',
  overallScore: 85,
  readiness: 'Interview Ready',
  roundScores: [
    { name: 'Aptitude', score: 90 },
    { name: 'Tech MCQ', score: 85 },
    { name: 'Coding', score: 95 },
    { name: 'Communication', score: 75 },
    { name: 'HR/AI', score: 80 },
  ],
  strengths: ['Data Structures & Algorithms', 'System Architecture knowledge', 'Problem-solving speed'],
  weaknesses: ['Verbal communication clarity', 'Behavioral STAR method answers'],
  feedback: "You demonstrated an excellent grasp of technical concepts and coding ability. Your logic is sound and you solve problems efficiently. However, during the HR and Communication rounds, your answers were sometimes unstructured. Try to use the STAR (Situation, Task, Action, Result) method to organize your thoughts better.",
  proctoring: {
    violations: 0,
    status: 'Clean'
  }
}

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Assessment Report</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
              {REPORT.type}
            </Badge>
          </div>
          <p className="text-zinc-500">
            For {REPORT.role} • Completed on {new Date(REPORT.date).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Readiness Score Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-100">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-6xl font-extrabold mb-2">{REPORT.overallScore}%</div>
            <div className="text-lg font-medium bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
              {REPORT.readiness}
            </div>
          </CardContent>
        </Card>

        {/* Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Round-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart data={REPORT.roundScores} />
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
              {REPORT.strengths.map((item, i) => (
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
              {REPORT.weaknesses.map((item, i) => (
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
          <CardTitle>Detailed AI Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            {REPORT.feedback}
          </p>
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
