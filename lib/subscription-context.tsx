"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Subscription {
  id: string
  plan_name: string
  billing_cycle: string
  status: string
  current_period_end: string
}

interface SubscriptionContextType {
  isSubscriber: boolean
  subscription: Subscription | null
  isLoading: boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSubscription = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSubscription(null)
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setSubscription(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSubscription()

    // Listen for auth changes
    const supabase = createClient()
    if (supabase) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
        refreshSubscription()
      })

      return () => {
        authSubscription.unsubscribe()
      }
    }
  }, [refreshSubscription])

  const isSubscriber = Boolean(
    subscription?.status === 'active' &&
    subscription?.current_period_end &&
    new Date(subscription.current_period_end) > new Date()
  )

  return (
    <SubscriptionContext.Provider value={{
      isSubscriber,
      subscription,
      isLoading,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}
