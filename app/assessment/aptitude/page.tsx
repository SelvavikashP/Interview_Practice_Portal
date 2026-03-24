'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProctorWrapper } from '@/components/assessment/proctor-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Clock, Flag, ChevronLeft, ChevronRight, Check } from 'lucide-react'

// Dummy data for MCQ
const MOCK_QUESTIONS = [
  { id: 1, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answer: 'O(log n)' },
  { id: 2, question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 'Stack' },
  { id: 3, question: 'What does SOLID stand for in OOP?', options: ['Single responsibility...', 'Synchronized...', 'Systematic...', 'Static...'], answer: 'Single responsibility...' },
  { id: 4, question: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?', options: ['120 metres', '180 metres', '324 metres', '150 metres'], answer: '150 metres' },
  { id: 5, question: 'Which algorithm is used to find the shortest path?', options: ['Dijkstra', 'DFS', 'Kruskal', 'Prims'], answer: 'Dijkstra' },
]

export default function AptitudeRoundPage() {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [isSubmitting, setIsSubmitting] = useState(false)

  const question = MOCK_QUESTIONS[currentIdx]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelect = (val: string) => {
    setAnswers({ ...answers, [question.id]: val })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call to grade
    await new Promise(r => setTimeout(r, 1500))
    // Calculate score locally for mock
    let score = 0
    MOCK_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.answer) score++
    })
    
    // Redirect to final report
    router.push(`/dashboard/history?score=${score}&total=${MOCK_QUESTIONS.length}`)
  }

  return (
    <ProctorWrapper>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
        {/* Header toolbar */}
        <header className="bg-white dark:bg-zinc-900 border-b flex items-center justify-between px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg">Aptitude & Technical Round</h1>
            <span className="text-zinc-500 text-sm">| {currentIdx + 1} of {MOCK_QUESTIONS.length}</span>
          </div>
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : ''}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 grid gap-8 md:grid-cols-3">
          {/* Question Area */}
          <div className="md:col-span-2 space-y-4">
            <Card className="min-h-[400px] flex flex-col">
              <CardHeader>
                <CardTitle className="leading-relaxed text-xl">
                  {currentIdx + 1}. {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <RadioGroup value={answers[question.id] || ''} onValueChange={handleSelect} className="space-y-4 mt-4">
                  {question.options.map((opt, i) => (
                    <div key={i} className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${answers[question.id] === opt ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'}`} onClick={() => handleSelect(opt)}>
                      <RadioGroupItem value={opt} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base leading-relaxed">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {currentIdx < MOCK_QUESTIONS.length - 1 ? (
                  <Button onClick={() => setCurrentIdx(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                    <Check className="mr-2 h-4 w-4" /> Submit Test
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Question Palette Sidebar */}
          <div className="hidden md:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm">Question Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {MOCK_QUESTIONS.map((q, i) => {
                    const isAnswered = !!answers[q.id]
                    const isCurrent = currentIdx === i
                    return (
                      <Button
                        key={q.id}
                        variant={(isCurrent ? "default" : isAnswered ? "secondary" : "outline") as any}
                        className={`w-10 h-10 p-0 ${isAnswered && !isCurrent ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}`}
                        onClick={() => setCurrentIdx(i)}
                      >
                        {i + 1}
                      </Button>
                    )
                  })}
                </div>
                <div className="mt-8 space-y-2 text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-zinc-300" /> Not Answered
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProctorWrapper>
  )
}
