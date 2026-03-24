import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, FileVideo, Code2, Users2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const stats = [
    { title: 'Readiness Level', value: 'Not Ready', desc: 'Complete assessments to improve', icon: CheckCircle2 },
    { title: 'Mock Interviews', value: '0', desc: 'Total interviews completed', icon: FileVideo },
    { title: 'Coding Challenges', value: '0', desc: 'Total coding rounds cleared', icon: Code2 },
    { title: 'Overall Score', value: '0%', desc: 'Based on recent performance', icon: Users2 },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-zinc-500 mt-2">
          Track your interview preparation progress and jump into your next assessment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-1">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              What you should focus on right now to improve your chances.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 border p-4 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-zinc-300" />
              <div className="flex-1">
                <h4 className="font-semibold">Setup Your Profile</h4>
                <p className="text-sm text-zinc-500">Upload your resume and select a target role.</p>
              </div>
              <Link href="/dashboard/resume">
                <Button>Start</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest assessment attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
              <p className="text-zinc-500 mb-4">No recent activity found. Start a mock interview to see stats here.</p>
              <Link href="/dashboard/assessments">
                <Button variant="outline">View Assessments</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
