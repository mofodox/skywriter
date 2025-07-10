import PostForm from '@/components/shared/PostForm'
import Feed from '@/components/shared/Feed'
import Logo from '@/components/shared/Logo'
import { PostsProvider } from '@/lib/PostsContext'

export default function Home() {
  return (
    <PostsProvider>
      <main className="flex min-h-screen bg-white overflow-hidden">
        <div className="w-full max-w-screen-xl mx-auto flex">
          {/* Left Column - Fixed */}
          <div className="w-1/2 p-6 h-screen flex flex-col">
            <div className="max-w-md mx-auto w-full">
              <header className="mb-6">
                <Logo />
              </header>
              
              <div className="mt-4">
                <PostForm />
              </div>
            </div>
          </div>
          
          {/* Right Column - Fixed with scrollable content */}
          <div className="w-1/2 p-6 border-l border-gray-200 h-screen flex flex-col feed-column">
            <div className="max-w-md mx-auto w-full flex flex-col h-full">
              <div className="flex-none">
                {/* <h2 className="text-xl font-semibold mb-4">Recent Posts</h2> */}
              </div>
              <div className="flex-grow overflow-y-auto pr-4">
                <Feed />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PostsProvider>
  )
}
