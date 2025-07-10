'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { 
  ReactionType, 
  fetchReactions, 
  getUserReaction, 
  toggleReaction 
} from '@/lib/reactionService'
import { supabase } from '@/lib/supabase'

interface ReactionsProps {
  postId: string
}

export default function Reactions({ postId }: ReactionsProps) {
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({ 
    love: 0, 
    support: 0, 
    hug: 0 
  })
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to load reactions from the database
  const loadReactions = useCallback(async () => {
    try {
      setError(null)
      console.log('Loading reactions for post:', postId)
      const counts = await fetchReactions(postId)
      const currentUserReaction = await getUserReaction(postId)
      
      console.log('Reaction counts:', counts, 'User reaction:', currentUserReaction)
      setReactions(counts)
      setUserReaction(currentUserReaction)
    } catch (err) {
      console.error('Error loading reactions:', err)
      setError('Failed to load reactions')
    }
  }, [postId])

  // Load initial reactions and set up real-time subscription
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true)
      await loadReactions()
      setIsLoading(false)
    }
    
    initialize()
    
    // Set up real-time subscription for reactions
    const channel = supabase
      .channel(`reactions-${postId}`)
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reactions',
          filter: `post_id=eq.${postId}`
        }, 
        (payload) => {
          console.log('INSERT event received:', payload)
          loadReactions()
        }
      )
      .on('postgres_changes', 
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reactions',
          filter: `post_id=eq.${postId}`
        }, 
        (payload) => {
          console.log('DELETE event received:', payload)
          loadReactions()
        }
      )
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reactions',
          filter: `post_id=eq.${postId}`
        }, 
        (payload) => {
          console.log('UPDATE event received:', payload)
          loadReactions()
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for post ${postId}:`, status)
      })
    
    // Clean up subscription on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [postId, loadReactions])

  const handleReaction = async (type: ReactionType) => {
    if (isProcessing) return
    
    try {
      setError(null)
      setIsProcessing(true)
      
      // Store previous state for rollback if needed
      const previousReactions = { ...reactions }
      const previousUserReaction = userReaction
      
      console.log('Processing reaction:', type, 'Current user reaction:', userReaction)
      
      // Skip optimistic update and directly call the API
      const success = await toggleReaction(postId, type)
      
      if (success) {
        console.log('Reaction toggled successfully, reloading data')
        // Only reload data after successful API call instead of optimistic update
        await loadReactions()
      } else {
        console.error('Failed to toggle reaction')
        setError('Failed to update reaction')
      }
    } catch (err) {
      console.error('Error in handleReaction:', err)
      setError('Failed to process reaction')
    } finally {
      setIsProcessing(false)
    }
  }

  const reactionEmojis: Record<ReactionType, { emoji: string, label: string, bgColor: string, activeColor: string }> = {
    love: { 
      emoji: '❤️', 
      label: 'Love',
      bgColor: 'bg-red-50 hover:bg-red-100',
      activeColor: 'bg-red-100'
    },
    support: { 
      emoji: '👍', 
      label: 'Support',
      bgColor: 'bg-green-50 hover:bg-green-100',
      activeColor: 'bg-green-100'
    },
    hug: { 
      emoji: '🤗', 
      label: 'Hug',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      activeColor: 'bg-blue-100'
    }
  }

  if (isLoading) {
    return <div className="flex items-center gap-2 mt-3 pt-3 border-t h-8"></div>
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mt-2">
        {(Object.entries(reactionEmojis) as [ReactionType, typeof reactionEmojis[ReactionType]][]).map(([type, { emoji, label, bgColor, activeColor }]) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={cn(
              "flex items-center justify-center rounded-full w-8 h-8 transition-all relative",
              userReaction === type 
                ? activeColor
                : bgColor,
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            )}
            disabled={isProcessing}
            aria-label={label}
          >
            <span className="text-sm">{emoji}</span>
            {reactions[type] > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-xs rounded-full w-4 h-4 flex items-center justify-center border border-gray-200 font-medium">
                {reactions[type]}
              </span>
            )}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
} 