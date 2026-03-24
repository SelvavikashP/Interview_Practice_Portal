'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProctorWrapper } from '@/components/assessment/proctor-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User } from 'lucide-react'
import { Suspense } from 'react'

type Message = {
  role: 'ai' | 'user'
  content: string
}

// Checks if an answer is too short or lazy
function isWeakAnswer(text: string): boolean {
  const trimmed = text.trim().toLowerCase()
  if (text.trim().length < 20) return true
  const lazyResponses = ['ok', 'okay', 'okey', 'fine', 'yes', 'no', 'sure', 'idk', 'good', 'great', 'yep', 'nope', 'yeah', 'yah']
  return lazyResponses.includes(trimmed)
}

// AI follow-up prompts for weak answers
const WEAK_ANSWER_FOLLOWUPS = [
  "That's a bit brief. Could you elaborate on that with a specific example?",
  "I'd like to hear more detail on that. Can you expand your answer?",
  "Interesting — could you walk me through that in more depth? Details and examples really help.",
  "That answer needs more context. Please share a concrete experience that demonstrates your point.",
]

function getQuestionBank(role: string, difficulty: string) {
  const isHard = difficulty === 'hard'
  const isMed = difficulty === 'medium'

  const baseQuestions: Record<string, string[]> = {
    'Full Stack Developer': [
      `Hello! I've reviewed your resume and see you're applying for the Full Stack Developer role. Let's start — could you briefly introduce yourself?`,
      isHard
        ? "Describe the most complex system architecture you've designed. How did you handle scalability?"
        : isMed
        ? "Tell me about a challenging full-stack project you built. What was your role and what did you learn?"
        : "What full-stack technologies do you know best and how have you used them in a project?",
      isHard
        ? "Explain how you'd design a distributed caching system to handle 1 million requests per second."
        : "How do you handle API performance bottlenecks in a Node.js + React application?",
      "Tell me about a time you disagreed with a teammate on a technical decision. How was it resolved?",
      isHard
        ? "What's your approach to zero-downtime database migrations in a production microservices environment?"
        : "How do you manage database migrations without breaking production?",
      "Where do you see your career heading in the next 3-5 years?",
      "Thank you for your time today. That concludes our interview. I'll now generate your performance report.",
    ],
    'Data Scientist': [
      `Hello! I can see you're targeting the Data Scientist role. Let's begin — could you introduce yourself?`,
      isHard
        ? "Describe a time you built and productionized an ML model end-to-end. What challenges did you face?"
        : "Tell me about a data project you're most proud of and why.",
      "What's your preferred approach to handling class imbalance in a classification problem?",
      "Tell me about a time you had to communicate complex data insights to a non-technical audience.",
      isHard
        ? "How would you design an A/B testing framework from scratch?"
        : "Walk me through how you would approach a large EDA on an unfamiliar dataset.",
      "Where do you see the future of AI in your target industry?",
      "Thank you for your time. That concludes our interview. I'll generate your performance report now.",
    ],
  }

  const defaultQuestions = [
    `Hello! I've reviewed your profile. Let's start the interview for your ${role || 'Software Developer'} role. Please introduce yourself.`,
    isHard
      ? "Describe the most technically complex project you've contributed to. What was your specific role and the outcome?"
      : "Tell me about a project you're most proud of.",
    "How do you stay updated with the latest trends and technologies in your field?",
    "Describe a time you faced a significant challenge at work. How did you overcome it?",
    "What are your key strengths and one area you're actively working to improve?",
    "Where do you see yourself professionally in three to five years?",
    "Thank you for your time. That concludes our interview. I'll generate your final report now.",
  ]

  return baseQuestions[role] || defaultQuestions
}

function AIInterviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'Full Stack Developer'
  const difficulty = searchParams.get('difficulty') || 'medium'

  const questions = getQuestionBank(role, difficulty)

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: questions[0] }
  ])
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [interviewStep, setInterviewStep] = useState(1) // starts at 1 because Q[0] is the greeting
  const [weakStreak, setWeakStreak] = useState(0)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!inputMsg.trim() || isTyping) return

    const userMessage = inputMsg.trim()
    setInputMsg('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Think time: 1.5–3s depending on answer length
    const thinkTime = Math.min(1500 + userMessage.length * 20, 3000)
    await new Promise(r => setTimeout(r, thinkTime))
    setIsTyping(false)

    // Check for weak/lazy answer
    if (isWeakAnswer(userMessage) && weakStreak < 2) {
      const followUp = WEAK_ANSWER_FOLLOWUPS[weakStreak % WEAK_ANSWER_FOLLOWUPS.length]
      setMessages(prev => [...prev, { role: 'ai', content: followUp }])
      setWeakStreak(prev => prev + 1)
      return
    }

    // Reset weak streak on good answer
    setWeakStreak(0)

    if (interviewStep < questions.length - 1) {
      setMessages(prev => [...prev, { role: 'ai', content: questions[interviewStep] }])
      setInterviewStep(prev => prev + 1)
    } else {
      // Final message
      setMessages(prev => [...prev, { role: 'ai', content: questions[questions.length - 1] }])
      setTimeout(() => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        }
        router.push('/dashboard/history?complete=1&type=hr-ai')
      }, 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  const isFinished = interviewStep >= questions.length && !isTyping && messages[messages.length - 1]?.content === questions[questions.length - 1]

  return (
    <ProctorWrapper>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4 py-8 md:p-8">
        <div className="w-full max-w-4xl flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-xl shadow-sm border overflow-hidden">
          
          {/* Header */}
          <header className="p-4 border-b bg-zinc-50 dark:bg-zinc-950 flex items-center gap-4 shrink-0">
            <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-full flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">AI Technical & HR Interviewer</h2>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Interaction • Role: {role} • Difficulty: <span className="capitalize">{difficulty}</span>
              </p>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Q{Math.min(interviewStep, questions.length - 1)}/{questions.length - 1}
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
                <div className={`rounded-xl p-4 max-w-[85%] sm:max-w-[75%] leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none border shadow-sm text-[15px]'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-zinc-600" />
                </div>
                <div className="rounded-xl px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border flex items-center gap-1 rounded-bl-none">
                  <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t shrink-0">
            {isFinished ? (
              <p className="text-center text-sm text-emerald-600 font-semibold py-2">Interview complete! Redirecting to your report...</p>
            ) : (
              <div className="relative flex items-center">
                <Input
                  placeholder="Type your response or answer here..."
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping || isFinished}
                  className="pr-12 h-14 bg-zinc-50 dark:bg-zinc-950 focus-visible:ring-1 text-base rounded-xl"
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700" 
                  onClick={handleSend}
                  disabled={!inputMsg.trim() || isTyping || isFinished}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-center text-xs text-zinc-400 mt-3 font-medium">
              Keep your answers concise and professional. Short answers will prompt follow-up questions.
            </p>
          </div>
        </div>
      </div>
    </ProctorWrapper>
  )
}

export default function AILiveInterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading interview...</div>}>
      <AIInterviewContent />
    </Suspense>
  )
}
