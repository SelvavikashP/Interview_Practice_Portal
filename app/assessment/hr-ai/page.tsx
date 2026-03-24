'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProctorWrapper } from '@/components/assessment/proctor-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Bot, User, CheckCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

type Message = {
  role: 'ai' | 'user'
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  { role: 'ai', content: "Hello! I am your AI Interviewer. I have reviewed your resume and see you're applying for the Full Stack Developer role. Let's start with a quick introduction. Could you tell me a little bit about yourself?" }
]

const MOCK_AI_RESPONSES = [
  "That sounds great. Given your experience with React and Node.js, can you explain a situation where you had to optimize a slow-performing API?",
  "Interesting approach. How do you handle database migrations in a production environment without causing downtime?",
  "I see. Moving on to behavioral questions, tell me about a time you disagreed with a team member on a technical decision. How was it resolved?",
  "Thanks for sharing. Finally, where do you see your career heading in the next 3 to 5 years?",
  "Thank you for your time today. That concludes our interview. I will now generate your final report."
]

export default function AILiveInterviewPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [interviewStep, setInterviewStep] = useState(0)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!inputMsg.trim()) return

    const userMessage = inputMsg.trim()
    setInputMsg('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    // Simulate AI thinking
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 2000)) // 2 sec delay

    setIsTyping(false)

    if (interviewStep < MOCK_AI_RESPONSES.length - 1) {
      setMessages(prev => [...prev, { role: 'ai', content: MOCK_AI_RESPONSES[interviewStep] }])
      setInterviewStep(prev => prev + 1)
    } else {
      setMessages(prev => [...prev, { role: 'ai', content: MOCK_AI_RESPONSES[interviewStep] }])
      // End of interview, redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/history?type=hr-ai&complete=1')
      }, 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <ProctorWrapper>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4 py-8 md:p-8">
        <div className="w-full max-w-4xl flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-xl shadow-sm border overflow-hidden">
          
          {/* Header */}
          <header className="p-4 border-b bg-zinc-50 dark:bg-zinc-950 flex items-center gap-4 shrink-0">
            <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-full flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold">AI Technical & HR Interviewer</h2>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Interaction
              </p>
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
            <div className="relative flex items-center">
              <Input
                placeholder="Type your response or answer here..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="pr-12 h-14 bg-zinc-50 dark:bg-zinc-950 focus-visible:ring-1 text-base rounded-xl"
              />
              <Button 
                size="icon" 
                className="absolute right-2 h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700" 
                onClick={handleSend}
                disabled={!inputMsg.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-center text-xs text-zinc-400 mt-3 font-medium">
              Keep your answers concise and professional.
            </p>
          </div>
        </div>
      </div>
    </ProctorWrapper>
  )
}
