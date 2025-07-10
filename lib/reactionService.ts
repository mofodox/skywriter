import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

// Define reaction types
export type ReactionType = 'love' | 'support' | 'hug'

// Check if code is running in browser
const isBrowser = typeof window !== 'undefined'

// Get or create a session ID for the current user
export const getSessionId = (): string => {
  // Make sure we're in a browser environment
  if (!isBrowser) {
    return ''
  }
  
  try {
    let sessionId = localStorage.getItem('skywriter_session_id')
    
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem('skywriter_session_id', sessionId)
    }
    
    return sessionId
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    // Generate a temporary session ID that won't be persisted
    return uuidv4()
  }
}

// Fetch reactions for a post
export const fetchReactions = async (postId: string) => {
  try {
    // Default counts
    const defaultCounts = { love: 0, support: 0, hug: 0 } as Record<ReactionType, number>
    
    if (!postId) {
      return defaultCounts
    }
    
    const { data, error } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('post_id', postId)
    
    if (error) {
      console.error('Error fetching reactions:', error)
      return defaultCounts
    }
    
    // Count reactions by type
    const counts = { ...defaultCounts }
    
    if (data && Array.isArray(data)) {
      data.forEach((reaction: { reaction_type: string }) => {
        const type = reaction.reaction_type as ReactionType
        if (counts[type] !== undefined) {
          counts[type]++
        }
      })
    }
    
    return counts
  } catch (error) {
    console.error('Unexpected error in fetchReactions:', error)
    return { love: 0, support: 0, hug: 0 }
  }
}

// Check if user has reacted to a post
export const getUserReaction = async (postId: string): Promise<ReactionType | null> => {
  try {
    if (!isBrowser || !postId) {
      return null
    }
    
    const sessionId = getSessionId()
    
    // If no session ID, return null
    if (!sessionId) {
      return null
    }
    
    const { data, error } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('post_id', postId)
      .eq('session_id', sessionId)
    
    if (error) {
      console.error('Error getting user reaction:', error.message || JSON.stringify(error))
      return null
    }
    
    if (!data || data.length === 0) {
      return null
    }
    
    // Return the first reaction type if multiple exist
    return data[0].reaction_type as ReactionType
  } catch (error: any) {
    console.error('Unexpected error in getUserReaction:', error?.message || JSON.stringify(error))
    return null
  }
}

// Toggle a reaction for a post
export const toggleReaction = async (postId: string, reactionType: ReactionType): Promise<boolean> => {
  try {
    if (!isBrowser || !postId || !reactionType) {
      console.error('Missing required parameters for toggleReaction')
      return false
    }
    
    const sessionId = getSessionId()
    
    // If no session ID, return false
    if (!sessionId) {
      console.error('No session ID available')
      return false
    }
    
    // First, check if the user has any reaction on this post
    const { data, error: fetchError } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('post_id', postId)
      .eq('session_id', sessionId)
    
    if (fetchError) {
      console.error('Error checking existing reaction:', fetchError.message || JSON.stringify(fetchError))
      return false
    }
    
    // Get the first reaction if multiple exist (should not happen, but handle it gracefully)
    const existingReaction = data && data.length > 0 ? data[0] : null
    
    // Case 1: User is clicking the same reaction they already gave (toggle off)
    if (existingReaction && existingReaction.reaction_type === reactionType) {
      // Delete all reactions from this user on this post (to clean up any duplicates)
      const { error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('session_id', sessionId)
      
      if (deleteError) {
        console.error('Error removing reaction:', deleteError.message || JSON.stringify(deleteError))
        return false
      }
      
      console.log('Successfully removed reaction')
      return true
    }
    
    // Case 2: User has a different reaction or no reaction
    // First delete any existing reactions (if any) - to clean up any duplicates
    // We do this even if existingReaction is null just to be safe
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('session_id', sessionId)
    
    if (deleteError) {
      console.error('Error removing previous reaction(s):', deleteError.message || JSON.stringify(deleteError))
      return false
    }
    
    // Then add the new reaction
    const { error: insertError } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        reaction_type: reactionType,
        session_id: sessionId
      })
    
    if (insertError) {
      console.error('Error adding reaction:', insertError.message || JSON.stringify(insertError))
      return false
    }
    
    console.log('Successfully added/updated reaction')
    return true
  } catch (error: any) {
    console.error('Unexpected error in toggleReaction:', error?.message || JSON.stringify(error))
    return false
  }
} 