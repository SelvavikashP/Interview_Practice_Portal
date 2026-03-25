'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
  'QA Engineer',
  'DevOps Beginner'
]

export default function ResumeSetupPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [extractedData, setExtractedData] = useState<{ skills?: string[], suggestedRole?: string } | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [uploadError, setUploadError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  async function handleUpload() {
    if (!file) return
    setIsUploading(true)
    setUploadError(null)
    
    // Simulate parsing the resume for 2 seconds
    await new Promise(r => setTimeout(r, 2000))

    if (file.name.toLowerCase().includes('certificate')) {
      setUploadError('Invalid document uploaded. Please upload a valid resume instead of a certificate.')
      setExtractedData(null)
      setSelectedRole('')
      setIsUploading(false)
      return
    }
    
    // Mock extracted data
    setExtractedData({
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'REST APIs'],
      suggestedRole: 'Full Stack Developer'
    })
    setSelectedRole('Full Stack Developer')
    setIsUploading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume & Profile Setup</h1>
        <p className="text-zinc-500 mt-2">
          Upload your resume to let our AI analyze your skills and suggest the best interview track.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Resume</CardTitle>
            <CardDescription>Supported formats: PDF, DOCX (Max 5MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Upload className="h-8 w-8 text-zinc-500" />
              </div>
              <div>
                <Label htmlFor="resume-upload" className="cursor-pointer text-primary font-semibold hover:underline">
                  Click to browse
                </Label>
                <input 
                  id="resume-upload" 
                  type="file" 
                  accept=".pdf,.docx" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <p className="text-sm text-zinc-500 mt-1">or drag and drop your file here</p>
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-md w-full justify-center">
                  <FileText className="h-4 w-4" />
                  {file.name}
                </div>
              )}
            </div>
            <Button 
              className="w-full" 
              onClick={handleUpload} 
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : 'Upload & Analyze AI'}
            </Button>
          </CardContent>
        </Card>

        {/* Role Selection Section */}
        <Card className={!extractedData && !uploadError ? 'opacity-50 pointer-events-none' : ''}>
          <CardHeader>
            <CardTitle>2. Confirm Target Role</CardTitle>
            <CardDescription>Based on your resume, or choose manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {extractedData && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-300">Analysis Complete</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
                      We detected top skills: <span className="font-semibold">{extractedData.skills?.join(', ')}</span>.
                      <br/> We suggest preparing for the <span className="font-semibold">{extractedData.suggestedRole}</span> role.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-lg border border-rose-200 dark:border-rose-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-rose-900 dark:text-rose-300">Analysis Failed</h4>
                    <p className="text-sm text-rose-700 dark:text-rose-400 mt-1 leading-relaxed">
                      {uploadError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Target Job Role</Label>
              <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!selectedRole || isUploading}>
              Save Profile Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
