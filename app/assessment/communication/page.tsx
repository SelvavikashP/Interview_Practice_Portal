'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProctorWrapper } from '@/components/assessment/proctor-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, Square, Check, RefreshCw, Volume2 } from 'lucide-react'

const PROMPTS = [
  "Please tell me about yourself and your background.",
  "Describe a challenging project you worked on and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Why do you want to work in this role?",
]

export default function CommunicationRoundPage() {
  const router = useRouter()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        let currentTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + trans + ' ')
          } else {
            currentTranscript += trans
          }
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsRecording(false)
      }
      
      recognitionRef.current = recognition
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      setTranscript('') // reset for new attempt
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const handleNext = () => {
    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt(prev => prev + 1)
      setTranscript('')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    if (isRecording) recognitionRef.current?.stop()
    await new Promise(r => setTimeout(r, 1500))
    router.push('/dashboard/history?type=communication')
  }

  return (
    <ProctorWrapper>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-8">
        <div className="max-w-3xl w-full mt-12 space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Communication Skills Round</h1>
            <p className="text-zinc-500">
              Speak clearly into your microphone. You are being evaluated on fluency, confidence, and grammatical correctness.
            </p>
          </div>

          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b pb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold uppercase text-zinc-500">Prompt {currentPrompt + 1} of {PROMPTS.length}</span>
                <Button variant="ghost" size="icon">
                  <Volume2 className="h-5 w-5 text-zinc-500" />
                </Button>
              </div>
              <CardTitle className="text-2xl leading-relaxed">
                "{PROMPTS[currentPrompt]}"
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center">
              
              <div className="relative mb-8">
                <Button 
                  size="lg" 
                  onClick={toggleRecording} 
                  className={`h-24 w-24 rounded-full transition-all duration-300 ${isRecording ? 'bg-rose-500 hover:bg-rose-600 animate-pulse ring-8 ring-rose-500/20' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isRecording ? <Square className="h-8 w-8 fill-white" /> : <Mic className="h-10 w-10" />}
                </Button>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 text-rose-500 font-medium animate-pulse mb-6">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  Recording your response...
                </div>
              )}

              <div className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-6 min-h-[150px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed shadow-inner">
                {transcript || <span className="text-zinc-400 italic">Your spoken response will appear here...</span>}
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-50 dark:bg-zinc-900 border-t justify-between p-6">
              <Button variant="outline" onClick={() => setTranscript('')} disabled={isRecording || !transcript}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
              
              {currentPrompt < PROMPTS.length - 1 ? (
                <Button onClick={handleNext} disabled={isRecording}>
                  Next Prompt
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isRecording || isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                  {isSubmitting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Finish Round
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProctorWrapper>
  )
}
