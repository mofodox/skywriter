'use client'

import { useEffect, useState } from 'react'
import PostCard, { Post } from './PostCard'
import { supabase } from '@/lib/supabase'
import { Flame, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

type Filter = 'All' | 'Rant' | 'Perfect Day'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('All')

  useEffect(() => {
    // Fetch initial posts
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        let query = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
        
        // Apply filter if not 'All'
        if (filter !== 'All') {
          query = query.eq('category', filter)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        if (data) setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        const newPost = payload.new as Post
        
        // Only add the new post to the state if it matches the current filter
        if (filter === 'All' || newPost.category === filter) {
          setPosts(currentPosts => [newPost, ...currentPosts])
        }
      })
      .subscribe()

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [filter])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      
      <div className="flex border-b mb-6">
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

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
} 