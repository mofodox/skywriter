import PostForm from '@/components/shared/PostForm'
import Feed from '@/components/shared/Feed'
import Logo from '@/components/shared/Logo'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8 flex justify-center">
          <Logo />
        </header>
        
        <section className="mb-8 p-6 bg-white rounded-lg border shadow-sm">
          <PostForm />
        </section>
        
        <section className="p-6 bg-white rounded-lg border shadow-sm">
          <Feed />
        </section>
      </div>
    </main>
  )
}
