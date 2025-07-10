import PostForm from '@/components/shared/PostForm'
import Feed from '@/components/shared/Feed'
import Logo from '@/components/shared/Logo'
import { PostsProvider } from '@/lib/PostsContext'

export default function Home() {
  return (
    <PostsProvider>
      <main className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/2 p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
            <div className="max-w-md mx-auto">
              <header className="mb-6">
                <Logo />
              </header>
              
              <div className="mt-4">
                <PostForm />
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="w-full md:w-1/2 p-6 md:border-l border-gray-200">
            <div className="max-w-md mx-auto">
              <Feed />
            </div>
          </div>
        </div>
      </main>
    </PostsProvider>
  )
}
