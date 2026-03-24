'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    target_role: ''
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setProfile({
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          bio: '',
          target_role: ''
        })

        // Fetch from profiles table
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile({
            first_name: data.first_name || user.user_metadata?.first_name || '',
            last_name: data.last_name || user.user_metadata?.last_name || '',
            bio: data.bio || '',
            target_role: data.target_role || ''
          })
        }
      }
    }
    loadProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Update Auth Metadata
      await supabase.auth.updateUser({
        data: { first_name: profile.first_name, last_name: profile.last_name }
      })

      // Update Profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          target_role: profile.target_role,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-zinc-900 dark:text-zinc-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-zinc-500 mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Review and update your basic details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  value={profile.first_name} 
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name" 
                  value={profile.last_name} 
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Input 
                id="bio" 
                placeholder="Tell us about your experience..." 
                value={profile.bio} 
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_role">Target Job Role</Label>
              <Input 
                id="target_role" 
                placeholder="e.g. Full Stack Developer" 
                value={profile.target_role} 
                onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 opacity-60">
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>Password updates are handled via email link.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              For security reasons, password changes require multi-factor verification. 
              Contact support if you need to reset your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
