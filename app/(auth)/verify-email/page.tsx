import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'

export default function VerifyEmail() {
  const router = useRouter()

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verify your Email</h1>
        <p className="mb-4">We have sent you a verification email. Please check your inbox and follow the instructions to verify your account.</p>
        <Button onClick={() => router.push('/signin')} className="mt-4">Go to Sign In</Button>
      </div>
    </div>
  )
}
