'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Camera, CheckCircle2, Mic, MonitorPlay } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Suspense } from 'react'

function AssessmentSetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'aptitude'

  const [camStatus, setCamStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [micStatus, setMicStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    async function requestPermissions() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setCamStatus('success')
        setMicStatus('success')
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        setCamStatus('error')
        setMicStatus('error')
      }
    }
    requestPermissions()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const allClear = camStatus === 'success' && micStatus === 'success'

  const handleStart = async () => {
    if (!allClear) return
    
    // Stop local stream before navigating
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
    }

    // Attempt to go fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e)
    }

    router.push(`/assessment/${type}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">System Check & Instructions</CardTitle>
          <CardDescription>
            Please ensure your hardware is working before starting the proctored assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Proctoring Enabled</AlertTitle>
            <AlertDescription>
              This assessment is proctored. Navigating away, switching tabs, or exiting full screen will result in a warning. Multiple warnings will auto-terminate your test.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${camStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                  {camStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-medium">Camera Access</h4>
                  <p className="text-sm text-zinc-500">{camStatus === 'success' ? 'Ready' : camStatus === 'error' ? 'Denied' : 'Checking...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${micStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                  {micStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-medium">Microphone Access</h4>
                  <p className="text-sm text-zinc-500">{micStatus === 'success' ? 'Ready' : micStatus === 'error' ? 'Denied' : 'Checking...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <MonitorPlay className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Fullscreen Requirement</h4>
                  <p className="text-sm text-zinc-500">Will be enabled upon starting</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg aspect-video overflow-hidden border">
              {camStatus === 'success' ? (
                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-zinc-400">
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-sm">Camera preview</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full text-lg h-12" 
            size="lg" 
            disabled={!allClear} 
            onClick={handleStart}
          >
            Enter Fullscreen & Start
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
