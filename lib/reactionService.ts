import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

// Define reaction types
export type ReactionType = 'love' | 'support' | 'hug'

// Get or create a session ID for the current user
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('skywriter_session_id')
  
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem('skywriter_session_id', sessionId)
  }
  
  return sessionId
}

// Fetch reactions for a post
export const fetchReactions = async (postId: string) => {
  const { data, error } = await supabase
    .from('reactions')
    .select('reaction_type')
    .eq('post_id', postId)
  
  if (error) {
    console.error('Error fetching reactions:', error)
    return { love: 0, support: 0, hug: 0 }
  }
  
  // Count reactions by type
  const counts = { love: 0, support: 0, hug: 0 } as Record<ReactionType, number>
  
  data.forEach(reaction => {
    const type = reaction.reaction_type as ReactionType
    if (counts[type] !== undefined) {
      counts[type]++
    }
  })
  
  return counts
}

// Check if user has reacted to a post
export const getUserReaction = async (postId: string): Promise<ReactionType | null> => {
  const sessionId = getSessionId()
  
  const { data, error } = await supabase
    .from('reactions')
    .select('reaction_type')
    .eq('post_id', postId)
    .eq('session_id', sessionId)
    .maybeSingle()
  
  if (error || !data) {
    return null
  }
  
  return data.reaction_type as ReactionType
}

// Toggle a reaction for a post
export const toggleReaction = async (postId: string, reactionType: ReactionType): Promise<void> => {
  const sessionId = getSessionId()
  
  // Check if the user already has this reaction
  const existingReaction = await getUserReaction(postId)
  
  // If user already has this reaction, remove it
  if (existingReaction === reactionType) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('session_id', sessionId)
      .eq('reaction_type', reactionType)
    
    if (error) {
      console.error('Error removing reaction:', error)
    }
  }
  // If user has a different reaction, update it
  else if (existingReaction) {
    const { error } = await supabase
      .from('reactions')
      .update({ reaction_type: reactionType })
      .eq('post_id', postId)
      .eq('session_id', sessionId)
    
    if (error) {
      console.error('Error updating reaction:', error)
    }
  }
  // If user has no reaction, add a new one
  else {
    const { error } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        reaction_type: reactionType,
        session_id: sessionId
      })
    
    if (error) {
      console.error('Error adding reaction:', error)
    }
  }
} 