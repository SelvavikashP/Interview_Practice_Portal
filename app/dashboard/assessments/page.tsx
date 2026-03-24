import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BrainCircuit, Code, MessagesSquare, Mic, ListChecks, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AssessmentsPage() {
  const rounds = [
    {
      id: 'aptitude',
      title: 'Aptitude & Technical MCQ',
      desc: 'Test your quant, logical reasoning, and CS fundamentals.',
      icon: ListChecks,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      id: 'coding',
      title: 'Coding Round',
      desc: 'Solve DSA questions in a time-constrained IDE environment.',
      icon: Code,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      desc: 'Practice speaking clearly and confidently structured answers.',
      icon: Mic,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      id: 'hr-ai',
      title: 'HR & Technical AI Interview',
      desc: 'Have a realistic, dynamic conversation with our AI interviewer.',
      icon: BrainCircuit,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      id: 'full-mock',
      title: 'Full Mock Interview',
      desc: 'The complete package. Go through all rounds sequentially.',
      icon: GraduationCap,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950',
    }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice Assessments</h1>
        <p className="text-zinc-500 mt-2">
          Choose a specific round to practice, or take a full mock interview. All tests are proctored to simulate real conditions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rounds.map((round) => {
          const Icon = round.icon
          return (
            <Card key={round.id} className="flex flex-col">
              <CardHeader>
                <div className={`p-3 w-fit rounded-lg ${round.bg} mb-4 border ${round.color.replace('text-', 'border-').replace('500', '200')}`}>
                  <Icon className={`h-6 w-6 ${round.color}`} />
                </div>
                <CardTitle>{round.title}</CardTitle>
                <CardDescription className="h-10 mt-2">{round.desc}</CardDescription>
              </CardHeader>
              <div className="flex-1" />
              <CardFooter>
                <Link href={`/assessment/setup?type=${round.id}`} className="w-full">
                  <Button className="w-full">
                    Start Practice
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
