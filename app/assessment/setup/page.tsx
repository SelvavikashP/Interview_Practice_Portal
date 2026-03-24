'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Camera, CheckCircle2, Mic, XCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type PermStatus = 'idle' | 'checking' | 'success' | 'error'

function AssessmentSetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'aptitude'

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [camStatus, setCamStatus] = useState<PermStatus>('idle')
  const [micStatus, setMicStatus] = useState<PermStatus>('idle')

  // Test camera + mic permissions without keeping stream open
  const handleTestPermissions = async () => {
    setCamStatus('checking')
    setMicStatus('checking')
    let mediaStream: MediaStream | null = null
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setCamStatus('success')
      setMicStatus('success')
    } catch (err) {
      setCamStatus('error')
      setMicStatus('error')
    } finally {
      // Immediately release the stream — we only needed permission confirmation
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }

  const allClear = camStatus === 'success' && micStatus === 'success'

  const handleStart = async () => {
    if (!allClear) return

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch (e) {
      console.warn('Fullscreen request failed', e)
    }

    router.push(`/assessment/${type}?difficulty=${difficulty}`)
  }

  const statusIcon = (status: PermStatus, Icon: React.ElementType, ReadyIcon: React.ElementType) => {
    if (status === 'success') return <ReadyIcon className="h-5 w-5" />
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-500" />
    if (status === 'checking') return <Loader2 className="h-5 w-5 animate-spin" />
    return <Icon className="h-5 w-5" />
  }

  const statusText = (status: PermStatus) => {
    if (status === 'success') return 'Verified ✓'
    if (status === 'error') return 'Access Denied'
    if (status === 'checking') return 'Checking...'
    return 'Not tested yet'
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 flex items-center justify-center">
      <Card className="max-w-3xl w-full border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl">Assessment Setup</CardTitle>
          <CardDescription>
            Choose your difficulty and verify device permissions before starting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Difficulty Selector */}
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Select Difficulty</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((lvl) => (
                <Button
                  key={lvl}
                  variant={difficulty === lvl ? 'default' : 'outline'}
                  size="sm"
                  className="capitalize"
                  onClick={() => setDifficulty(lvl)}
                >
                  {lvl === 'easy' && '🟢 '}
                  {lvl === 'medium' && '🟡 '}
                  {lvl === 'hard' && '🔴 '}
                  {lvl}
                </Button>
              ))}
            </div>
          </div>

          {/* Permission Check */}
          <div className="border rounded-lg divide-y dark:border-zinc-800 dark:divide-zinc-800">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${camStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : camStatus === 'error' ? 'bg-red-100 text-red-500' : 'bg-zinc-100 text-zinc-500'}`}>
                  {statusIcon(camStatus, Camera, CheckCircle2)}
                </div>
                <div>
                  <h4 className="font-medium">Camera</h4>
                  <p className={`text-sm ${camStatus === 'error' ? 'text-red-500' : camStatus === 'success' ? 'text-emerald-600' : 'text-zinc-500'}`}>
                    {statusText(camStatus)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 max-w-[180px] text-right">
                Camera will only turn on during the assessment, not on this page.
              </p>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${micStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : micStatus === 'error' ? 'bg-red-100 text-red-500' : 'bg-zinc-100 text-zinc-500'}`}>
                  {statusIcon(micStatus, Mic, CheckCircle2)}
                </div>
                <div>
                  <h4 className="font-medium">Microphone</h4>
                  <p className={`text-sm ${micStatus === 'error' ? 'text-red-500' : micStatus === 'success' ? 'text-emerald-600' : 'text-zinc-500'}`}>
                    {statusText(micStatus)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 max-w-[180px] text-right">
                Used for speech detection during the assessment.
              </p>
            </div>
          </div>

          {camStatus === 'idle' || camStatus === 'error' ? (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={handleTestPermissions}
              disabled={camStatus === 'checking'}
            >
              {camStatus === 'checking' ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking permissions...</>
              ) : camStatus === 'error' ? (
                <><XCircle className="mr-2 h-4 w-4 text-red-500" /> Retry Permission Check</>
              ) : (
                <><Camera className="mr-2 h-4 w-4" /> Verify Camera & Mic Access</>
              )}
            </Button>
          ) : null}

          <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Proctoring Notice</AlertTitle>
            <AlertDescription className="text-xs">
              Camera & microphone will be accessed only during the assessment. Tab switching or exiting fullscreen will result in termination.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-lg h-12"
            size="lg"
            disabled={!allClear}
            onClick={handleStart}
          >
            Enter Fullscreen & Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function AssessmentSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading setup...</div>}>
      <AssessmentSetupContent />
    </Suspense>
  )
}
