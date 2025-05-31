import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yoveamzpdqepjgafqgjl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdmVhbXpwZHFlcGpnYWZxZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDY1NzQsImV4cCI6MjA2NDI4MjU3NH0.LwJvOykhXi_VSHmWG-OicUcgaj5uE8ytTlAWUgQpvVA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  category: string
  live_url?: string
  github_url?: string
  image_url?: string
  images?: string[]
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  category: string
  skill_name: string
  display_order: number
  created_at: string
}

export interface PersonalInfo {
  id: number
  name: string
  title: string
  description: string
  email: string
  phone: string
  location: string
  github_url: string
  linkedin_url: string
  updated_at: string
}

// API functions
export const projectsAPI = {
  // Get all projects
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Project[]
  },

  // Get featured projects only
  async getFeatured() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Project[]
  },

  // Create new project
  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
    
    if (error) throw error
    return data[0] as Project
  },

  // Update project
  async update(id: number, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Project
  },

  // Delete project
  async delete(id: number) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const skillsAPI = {
  // Get all skills grouped by category
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Skill[]
  },

  // Create new skill
  async create(skill: Omit<Skill, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
    
    if (error) throw error
    return data[0] as Skill
  },

  // Update skill
  async update(id: number, updates: Partial<Skill>) {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Skill
  },

  // Delete skill
  async delete(id: number) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const personalInfoAPI = {
  // Get personal info
  async get() {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .single()
    
    if (error) throw error
    return data as PersonalInfo
  },

  // Update personal info
  async update(updates: Partial<PersonalInfo>) {
    const { data, error } = await supabase
      .from('personal_info')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
    
    if (error) throw error
    return data[0] as PersonalInfo
  }
}
