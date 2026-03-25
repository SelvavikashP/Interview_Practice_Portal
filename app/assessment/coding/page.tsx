'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProctorWrapper } from '@/components/assessment/proctor-wrapper'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Check, Clock, RefreshCw } from 'lucide-react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

// Languages supported by Piston v2
const LANGUAGES = {
  python: { version: '3.10.0', defaultCode: 'def solve(n):\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    print(solve(5))' },
  javascript: { version: '18.15.0', defaultCode: 'function solve(n) {\n    // Write your code here\n}\n\nconsole.log(solve(5));' },
  java: { version: '15.0.2', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello");\n    }\n}' },
  cpp: { version: '10.2.0', defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    cout << "Hello" << endl;\n    return 0;\n}' }
}

function CodingRoundContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const difficulty = searchParams.get('difficulty') || 'medium'
  const monaco = useMonaco()
  
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>('python')
  const [code, setCode] = useState(LANGUAGES['python'].defaultCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('dracula', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: { 'editor.background': '#18181b' }
      })
      monaco.editor.setTheme('dracula')
    }
  }, [monaco])

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleLanguageChange = (lang: keyof typeof LANGUAGES) => {
    setLanguage(lang)
    setCode(LANGUAGES[lang].defaultCode)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('Running code...')
    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          version: LANGUAGES[language].version,
          files: [{ content: code }]
        })
      })
      const data = await res.json()
      
      if (data.run && data.run.output) {
        setOutput(data.run.output)
      } else if (data.message) {
        setOutput(`Error: ${data.message}`)
      } else {
        setOutput('Code executed successfully with no output.')
      }
    } catch (error) {
      setOutput('Failed to execute code. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    router.push('/dashboard/history?type=coding&complete=1')
  }

  return (
    <ProctorWrapper isFinished={isSubmitting}>
      <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b h-14 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg border-r pr-4">Coding Round</h1>
            <span className="text-zinc-500 font-medium">Problem: Two Sum</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1 rounded bg-zinc-100 dark:bg-zinc-800 ${timeLeft < 300 ? 'text-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}>
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Left Panel - Problem Description */}
          <div className="w-2/5 h-full bg-white dark:bg-zinc-900 border-r overflow-y-auto p-6 space-y-6 flex flex-col">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold">1. Two Sum</h2>
                    <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                      difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                      difficulty === 'hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                    }`}>{difficulty}</span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
                    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
                    <p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>
                    <p>You can return the answer in any order.</p>

                    <h4 className="mt-6 mb-2 font-bold text-black dark:text-white">Example 1:</h4>
                    <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border">
                      <strong>Input:</strong> nums = [2,7,11,15], target = 9<br/>
                      <strong>Output:</strong> [0,1]<br/>
                      <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
                    </pre>

                    <h4 className="mt-6 mb-2 font-bold text-black dark:text-white">Constraints:</h4>
                    <ul className="list-disc pl-5">
                      <li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
                      <li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
                      <li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
                      <li><strong>Only one valid answer exists.</strong></li>
                    </ul>
                  </div>
                </div>
          </div>
          

          <div className="w-2 bg-zinc-200 dark:bg-zinc-800 flex flex-col justify-center items-center">
            <div className="h-8 w-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
          </div>

          {/* Right Panel - Editor & Console */}
          <div className="w-3/5 h-full flex flex-col">
            {/* Editor Toolbar */}
              <div className="h-12 bg-zinc-50 dark:bg-zinc-900 border-b flex items-center justify-between px-4 shrink-0">
                <Select value={language} onValueChange={(val) => handleLanguageChange(val as keyof typeof LANGUAGES)}>
                  <SelectTrigger className="w-[180px] h-8 text-xs bg-white dark:bg-zinc-800">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python 3</SelectItem>
                    <SelectItem value="javascript">JavaScript (Node.js)</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold" onClick={handleRun} disabled={isRunning}>
                    {isRunning ? <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
                    Run Code
                  </Button>
                  <Button size="sm" className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSubmit} disabled={isSubmitting}>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Submit
                  </Button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 min-h-0 bg-[#18181b]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme="dracula"
                  onChange={(val) => setCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                  }}
                />
              </div>

              {/* Console output dock */}
              <div className="h-48 bg-white dark:bg-zinc-950 border-t flex flex-col shrink-0">
                <Tabs defaultValue="output" className="h-full flex flex-col">
                  <div className="border-b px-2 bg-zinc-50 dark:bg-zinc-900 flex shrink-0">
                    <TabsList className="h-9 bg-transparent p-0 rounded-none">
                      <TabsTrigger value="output" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Output</TabsTrigger>
                      <TabsTrigger value="testcases" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Test Cases</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="output" className="flex-1 p-4 overflow-y-auto m-0">
                    {output ? (
                      <pre className="font-mono text-sm whitespace-pre-wrap">{output}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                        Run your code to see output here.
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="testcases" className="flex-1 p-4 overflow-y-auto m-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Case 1</Label>
                        <div className="p-2 border rounded font-mono text-xs bg-zinc-50 dark:bg-zinc-900">nums = [2,7,11,15], target = 9</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Case 2</Label>
                        <div className="p-2 border rounded font-mono text-xs bg-zinc-50 dark:bg-zinc-900">nums = [3,2,4], target = 6</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProctorWrapper>
  )
}

export default function CodingRoundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading coding round...</div>}>
      <CodingRoundContent />
    </Suspense>
  )
}
