'use client'

import PostCard from './PostCard'
import { Flame, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePosts } from '@/lib/PostsContext'

export default function Feed() {
  const { posts, loading, filter, setFilter } = usePosts()

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b mb-6 sticky top-0 bg-white z-10">
        <button 
          onClick={() => setFilter('All')}
          className={cn(
            "flex-1 py-2 text-center font-medium",
            filter === 'All' 
              ? "border-b-2 border-blue-500 text-blue-500" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          All Posts
        </button>
        <button 
          onClick={() => setFilter('Rant')}
          className={cn(
            "flex-1 py-2 text-center font-medium flex items-center justify-center gap-1.5",
            filter === 'Rant' 
              ? "border-b-2 border-red-500 text-red-500" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Flame size={16} className={filter === 'Rant' ? "text-red-500" : ""} /> Rants
        </button>
        <button 
          onClick={() => setFilter('Perfect Day')}
          className={cn(
            "flex-1 py-2 text-center font-medium flex items-center justify-center gap-1.5",
            filter === 'Perfect Day' 
              ? "border-b-2 border-amber-500 text-amber-500" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Sun size={16} className={filter === 'Perfect Day' ? "text-amber-500" : ""} /> Perfect Days
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  )
} 