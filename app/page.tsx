import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Bot, Code, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-blue-900/50">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            InterviewOS
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">Sign in</Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Badge className="mb-6 mx-auto bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 hover:bg-blue-100">
            Now with AI Interviewer
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Nail your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">interview</span> with realistic practice.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, take proctored role-specific mock interviews, practice coding in a real IDE, and chat with our AI HR interviewer.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xl w-full">
                Start Practicing Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Preview Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto relative z-10 px-4">
          <FeatureCard 
            icon={<Bot className="h-6 w-6 text-indigo-500" />}
            title="Interactive AI HR"
            desc="Practice behavioral and technical questions dynamically generated from your uploaded resume."
          />
          <FeatureCard 
            icon={<Code className="h-6 w-6 text-emerald-500" />}
            title="Proctored Coding IDE"
            desc="Solve algorithmic challenges in a timed, proctored environment with language support and test cases."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-rose-500" />}
            title="Deep Performance Analytics"
            desc="Get a detailed report on your strengths, weaknesses, and readiness level after each mock attempt."
          />
        </div>
      </main>

      <footer className="border-t py-8 bg-white dark:bg-zinc-900 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} InterviewOS. Built for serious job seekers.</p>
      </footer>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center justify-center border ${className || ''}`}>
      {children}
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-slate-50 dark:bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 dark:text-zinc-100">{title}</h3>
      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  )
}
