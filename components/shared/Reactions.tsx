'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  ReactionType, 
  fetchReactions, 
  getUserReaction, 
  toggleReaction 
} from '@/lib/reactionService'

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

  // Load initial reactions
  useEffect(() => {
    const loadReactions = async () => {
      try {
        setIsLoading(true)
        const counts = await fetchReactions(postId)
        const userReaction = await getUserReaction(postId)
        
        setReactions(counts)
        setUserReaction(userReaction)
      } catch (error) {
        console.error('Error loading reactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadReactions()
  }, [postId])

  const handleReaction = async (type: ReactionType) => {
    // Optimistic update
    if (userReaction === type) {
      // Remove reaction
      setReactions(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1)
      }))
      setUserReaction(null)
    } else if (userReaction) {
      // Change reaction
      setReactions(prev => ({
        ...prev,
        [userReaction]: Math.max(0, prev[userReaction] - 1),
        [type]: prev[type] + 1
      }))
      setUserReaction(type)
    } else {
      // Add reaction
      setReactions(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }))
      setUserReaction(type)
    }

    // Persist to database
    try {
      await toggleReaction(postId, type)
    } catch (error) {
      console.error('Error toggling reaction:', error)
      
      // Revert optimistic update on error
      const counts = await fetchReactions(postId)
      const userReaction = await getUserReaction(postId)
      
      setReactions(counts)
      setUserReaction(userReaction)
    }
  }

  const reactionEmojis: Record<ReactionType, { emoji: string, label: string, bgColor: string }> = {
    love: { 
      emoji: '❤️', 
      label: 'Love',
      bgColor: 'bg-red-100 hover:bg-red-200'
    },
    support: { 
      emoji: '👍', 
      label: 'Support',
      bgColor: 'bg-green-100 hover:bg-green-200'
    },
    hug: { 
      emoji: '🤗', 
      label: 'Hug',
      bgColor: 'bg-blue-100 hover:bg-blue-200'
    }
  }

  if (isLoading) {
    return <div className="flex items-center gap-2 mt-3 pt-3 border-t h-8"></div>
  }

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
      {(Object.entries(reactionEmojis) as [ReactionType, typeof reactionEmojis[ReactionType]][]).map(([type, { emoji, label, bgColor }]) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 transition-all relative",
            userReaction === type 
              ? `${bgColor} ring-2 ring-offset-1 ring-gray-300` 
              : `bg-gray-100 hover:${bgColor}`
          )}
          aria-label={label}
        >
          <span className="text-sm">{emoji}</span>
          {reactions[type] > 0 && (
            <span className="absolute -top-1 -right-1 bg-gray-200 text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {reactions[type]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
} 