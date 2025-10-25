// app/login/page.tsx
'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          API Sentinel Login 🛡️
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']} // Quick social login for demo
          redirectTo={`${window.location.origin}/dashboard`}
          onlyThirdPartyProviders={true} // Focus on quick social login
          theme="dark"
        />
      </div>
    </div>
  )
}