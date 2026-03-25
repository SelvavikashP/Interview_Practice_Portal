'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProctorWrapper } from '@/components/assessment/proctor-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react'

type Question = {
  id: number
  question: string
  options: string[]
  answer: string
}

const ALL_QUESTIONS: Record<string, Record<string, Question[]>> = {
  'Full Stack Developer': {
    easy: [
      { id: 1, question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HyperText Machine Language', 'Hyper Transfer Markup Language', 'None'], answer: 'HyperText Markup Language' },
      { id: 2, question: 'Which command installs a Node.js package?', options: ['node install', 'npm install', 'pkg add', 'yarn new'], answer: 'npm install' },
      { id: 3, question: 'What is a REST API?', options: ['A database type', 'An architectural style for networked apps', 'A CSS framework', 'A test tool'], answer: 'An architectural style for networked apps' },
      { id: 4, question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Syntax', 'Computer Style Sheets', 'Cascading Syntax Sheets'], answer: 'Cascading Style Sheets' },
      { id: 5, question: 'Which is NOT a JavaScript framework?', options: ['React', 'Angular', 'Django', 'Vue'], answer: 'Django' },
    ],
    medium: [
      { id: 1, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answer: 'O(log n)' },
      { id: 2, question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 'Stack' },
      { id: 3, question: 'What does SOLID stand for in OOP?', options: ['Single responsibility, Open/closed, Liskov, Interface, Dependency', 'Synchronized...', 'Systematic...', 'Static...'], answer: 'Single responsibility, Open/closed, Liskov, Interface, Dependency' },
      { id: 4, question: 'A train at 60 km/hr crosses a pole in 9 seconds. What is its length?', options: ['120 metres', '180 metres', '324 metres', '150 metres'], answer: '150 metres' },
      { id: 5, question: 'Which algorithm finds the shortest path?', options: ['Dijkstra', 'DFS', 'Kruskal', 'Prims'], answer: 'Dijkstra' },
    ],
    hard: [
      { id: 1, question: 'Which isolation level prevents phantom reads?', options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'], answer: 'Serializable' },
      { id: 2, question: 'In React, what does useCallback prevent?', options: ['State mutation', 'Child re-renders from new function references', 'DOM leaks', 'Prop drilling'], answer: 'Child re-renders from new function references' },
      { id: 3, question: 'What is the CAP theorem?', options: ['A CSS rule', 'Consistency, Availability, Partition tolerance trade-off', 'Cache, API, Persistence model', 'None of the above'], answer: 'Consistency, Availability, Partition tolerance trade-off' },
      { id: 4, question: 'What is the purpose of database sharding?', options: ['Data encryption', 'Horizontal scaling by partitioning data', 'Backup strategy', 'Query caching'], answer: 'Horizontal scaling by partitioning data' },
      { id: 5, question: 'In OAuth 2.0, what does the access token represent?', options: ['User password', 'Authorization grant for accessing resources', 'Session cookie', 'API key'], answer: 'Authorization grant for accessing resources' },
    ],
  },
  'Data Scientist': {
    easy: [
      { id: 1, question: 'What does ML stand for?', options: ['Machine Language', 'Machine Learning', 'Meta Logic', 'Model Layer'], answer: 'Machine Learning' },
      { id: 2, question: 'Which library is used for data manipulation in Python?', options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'], answer: 'Pandas' },
      { id: 3, question: 'What is a DataFrame?', options: ['A 2D labeled data structure', 'A neural network', 'A visualization tool', 'A type of database'], answer: 'A 2D labeled data structure' },
      { id: 4, question: 'What does EDA stand for?', options: ['Error Detection Analysis', 'Exploratory Data Analysis', 'Extrapolation Data Approach', 'None'], answer: 'Exploratory Data Analysis' },
      { id: 5, question: 'Which of the following is a supervised learning algorithm?', options: ['K-Means', 'PCA', 'Linear Regression', 'DBSCAN'], answer: 'Linear Regression' },
    ],
    medium: [
      { id: 1, question: 'What metric is used to evaluate a classification model?', options: ['RMSE', 'F1 Score', 'R²', 'MSE'], answer: 'F1 Score' },
      { id: 2, question: 'What is overfitting?', options: ['Model performs well on train but not test data', 'Model has too few parameters', 'Model underpredicts target', 'None'], answer: 'Model performs well on train but not test data' },
      { id: 3, question: 'What is the purpose of cross-validation?', options: ['Speed up training', 'Estimate model performance on unseen data', 'Reduce dataset size', 'Normalize features'], answer: 'Estimate model performance on unseen data' },
      { id: 4, question: 'Which algorithm is used for dimensionality reduction?', options: ['Random Forest', 'PCA', 'SVM', 'KNN'], answer: 'PCA' },
      { id: 5, question: 'What does AUC-ROC measure?', options: ['Regression accuracy', 'Model discrimination ability', 'Feature importance', 'Training time'], answer: 'Model discrimination ability' },
    ],
    hard: [
      { id: 1, question: 'What is the bias-variance tradeoff?', options: ['Balancing training speed vs accuracy', 'Balancing underfitting vs overfitting', 'Balancing data size vs model size', 'None'], answer: 'Balancing underfitting vs overfitting' },
      { id: 2, question: 'Which technique handles class imbalance?', options: ['PCA', 'SMOTE', 'Gradient Descent', 'L2 Regularization'], answer: 'SMOTE' },
      { id: 3, question: 'What is the Gini Impurity used for?', options: ['Neural network optimization', 'Decision tree splitting criterion', 'Clustering evaluation', 'Feature scaling'], answer: 'Decision tree splitting criterion' },
      { id: 4, question: 'What does SHAP stand for?', options: ['Shapley Additive exPlanations', 'Statistical Hypothesis and Prediction', 'Structured Hierarchical Analysis Process', 'None'], answer: 'Shapley Additive exPlanations' },
      { id: 5, question: 'Which loss function is used in logistic regression?', options: ['MSE', 'Cross-entropy loss', 'Hinge loss', 'Huber loss'], answer: 'Cross-entropy loss' },
    ],
  },
}

const DEFAULT_QUESTIONS: Record<string, Question[]> = {
  easy: [
    { id: 1, question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Printed Unit', 'None'], answer: 'Central Processing Unit' },
    { id: 2, question: 'What is an algorithm?', options: ['A type of hardware', 'A step-by-step problem-solving process', 'A network protocol', 'A database'], answer: 'A step-by-step problem-solving process' },
    { id: 3, question: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'High Text Transfer Process', 'HyperText Tool Protocol', 'None'], answer: 'HyperText Transfer Protocol' },
    { id: 4, question: 'What is the binary value of the decimal number 5?', options: ['100', '101', '110', '111'], answer: '101' },
    { id: 5, question: 'What is RAM used for?', options: ['Long-term storage', 'Temporary fast-access memory', 'Running the operating system', 'None'], answer: 'Temporary fast-access memory' },
  ],
  medium: [
    { id: 1, question: 'What is the time complexity of linear search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 'O(n)' },
    { id: 2, question: 'What is a deadlock in OS?', options: ['Endless loop', 'Two processes blocking each other indefinitely', 'Memory overflow', 'CPU overload'], answer: 'Two processes blocking each other indefinitely' },
    { id: 3, question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Question Language', 'Standard Query Logic', 'None'], answer: 'Structured Query Language' },
    { id: 4, question: 'Which protocol ensures reliable data transmission?', options: ['UDP', 'TCP', 'FTP', 'SMTP'], answer: 'TCP' },
    { id: 5, question: 'What is polymorphism in OOP?', options: ['One class, many implementations', 'One function, one purpose', 'Data hiding', 'None'], answer: 'One class, many implementations' },
  ],
  hard: [
    { id: 1, question: 'What is a race condition?', options: ['A performance test', 'Concurrent access to shared resource without proper sync', 'A CPU scheduling issue', 'None'], answer: 'Concurrent access to shared resource without proper sync' },
    { id: 2, question: 'What is dynamic programming?', options: ['Programming using Python', 'Solving problems by breaking into overlapping subproblems', 'Real-time scripting', 'None'], answer: 'Solving problems by breaking into overlapping subproblems' },
    { id: 3, question: 'What is the purpose of a memory barrier?', options: ['Prevent stack overflow', 'Enforce memory operation ordering in concurrent code', 'Allocate heap memory', 'None'], answer: 'Enforce memory operation ordering in concurrent code' },
    { id: 4, question: 'Which sorting algorithm has the best worst-case time complexity?', options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'], answer: 'Merge Sort' },
    { id: 5, question: 'What is the difference between process and thread?', options: ['No difference', 'Process has its own memory, threads share memory', 'Thread is faster always', 'Process is lighter'], answer: 'Process has its own memory, threads share memory' },
  ],
}

function getQuestions(role: string, difficulty: string): Question[] {
  const roleBank = ALL_QUESTIONS[role]
  if (roleBank) return roleBank[difficulty] || roleBank['medium']
  return DEFAULT_QUESTIONS[difficulty] || DEFAULT_QUESTIONS['medium']
}

function AptitudeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'Full Stack Developer'
  const difficulty = searchParams.get('difficulty') || 'medium'

  const questions = getQuestions(role, difficulty)

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const question = questions[currentIdx]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelect = (val: string) => setAnswers({ ...answers, [question.id]: val })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    let correct = 0
    questions.forEach(q => { if (answers[q.id] === q.answer) correct++ })
    const score = Math.round((correct / questions.length) * 100)
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    router.push(`/dashboard/history?score=${score}&total=${questions.length}&complete=1&type=aptitude`)
  }

  return (
    <ProctorWrapper isFinished={isSubmitting}>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
        <header className="bg-white dark:bg-zinc-900 border-b flex items-center justify-between px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg">Aptitude & Technical Round</h1>
            <span className="text-zinc-500 text-sm capitalize">| {role} — {difficulty}</span>
            <span className="text-zinc-500 text-sm">| Q{currentIdx + 1}/{questions.length}</span>
          </div>
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : ''}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 grid gap-8 md:grid-cols-3">
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
                    <div
                      key={i}
                      className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${answers[question.id] === opt ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                      onClick={() => handleSelect(opt)}
                    >
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
                {currentIdx < questions.length - 1 ? (
                  <Button onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}>
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

          <div className="hidden md:block">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm">Question Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, i) => {
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
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Answered</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-zinc-300" /> Not Answered</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProctorWrapper>
  )
}

export default function AptitudeRoundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading assessment...</div>}>
      <AptitudeContent />
    </Suspense>
  )
}
