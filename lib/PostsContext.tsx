'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/components/shared/PostCard'

type Filter = 'All' | 'Rant' | 'Perfect Day'

interface PostsContextType {
  posts: Post[]
  loading: boolean
  filter: Filter
  setFilter: (filter: Filter) => void
  addPost: (post: Post) => void
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('All')

  // Fetch posts when filter changes
  useEffect(() => {
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
    const channel = supabase
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
      channel.unsubscribe()
    }
  }, [filter])

  // Function to add a new post (used when submitting from the form)
  const addPost = (post: Post) => {
    // Only add if it matches the current filter
    if (filter === 'All' || post.category === filter) {
      setPosts(currentPosts => [post, ...currentPosts])
    }
  }

  return (
    <PostsContext.Provider value={{ posts, loading, filter, setFilter, addPost }}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider')
  }
  return context
} 