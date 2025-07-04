import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
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
  show_on_company?: boolean
  show_on_portfolio?: boolean
  created_at: string
  updated_at: string
}

export interface CompanyInfo {
  id: number
  company_name: string
  company_description?: string
  about_description?: string
  company_logo_url?: string
  company_email?: string
  company_phone?: string
  company_address?: string
  company_website?: string
  company_linkedin?: string
  company_twitter?: string
  company_youtube?: string
  company_facebook?: string
  company_instagram?: string
  founded_year?: number
  team_size?: string
  clients_count?: number
  projects_count?: number
  mission_statement?: string
  vision_statement?: string
  created_at: string
  updated_at: string
}

export interface PortfolioInfo {
  id: number
  name: string
  title: string
  description?: string
  email?: string
  phone?: string
  location?: string
  website?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  profile_image_url?: string
  skills?: string[]
  years_experience?: number
  projects_completed?: number
  happy_clients?: number
  cv_url?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: number
  name: string
  description?: string
  short_description?: string
  price?: number
  currency: string
  product_type: 'app' | 'service' | 'subscription'
  category?: string
  features?: string[]
  images?: string[]
  demo_url?: string
  download_url?: string
  is_featured: boolean
  is_active: boolean
  project_id?: number
  subscription_type?: 'monthly' | 'yearly' | 'one-time'
  display_order: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  title: string
  name?: string
  description?: string
  short_description?: string
  icon_name?: string
  price?: number
  price_starting_from?: number
  currency: string
  features?: string[]
  images?: string[]
  delivery_time?: string
  category?: string
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// API Functions
export const companyAPI = {
  async getInfo(): Promise<CompanyInfo | null> {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching company info:', error)
      return null
    }

    return data
  },

  async updateInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo | null> {
    const { data, error } = await supabase
      .from('company_info')
      .update(info)
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      console.error('Error updating company info:', error)
      return null
    }

    return data
  }
}

// Portfolio API
export const portfolioAPI = {
  async getInfo(): Promise<PortfolioInfo | null> {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error fetching portfolio info:', error)
      // If record doesn't exist, try to create it
      if (error.code === 'PGRST116') {
        return await this.createDefaultRecord()
      }
      return null
    }

    return data
  },

  async updateInfo(info: Partial<PortfolioInfo>): Promise<PortfolioInfo | null> {
    // Always update the record with id = 1
    const { data, error } = await supabase
      .from('personal_info')
      .update({
        ...info,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      console.error('Error updating portfolio info:', error)
      return null
    }

    return data
  },

  async createDefaultRecord(): Promise<PortfolioInfo | null> {
    const defaultData = {
      id: 1,
      name: 'اسم المطور',
      title: 'مطور ويب وتطبيقات',
      description: 'مطور متخصص في تطوير المواقع والتطبيقات باستخدام أحدث التقنيات',
      email: 'developer@example.com',
      phone: '+201234567890',
      location: 'القاهرة، مصر',
      website: '',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      profile_image_url: '',
      skills: [],
      years_experience: 0,
      projects_completed: 0,
      happy_clients: 0,
      cv_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('personal_info')
      .insert(defaultData)
      .select()
      .single()

    if (error) {
      console.error('Error creating default portfolio record:', error)
      return null
    }

    return data
  }
}

export const productsAPI = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  },

  async getFeatured(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }

    return data || []
  },

  async getById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return null
    }

    return data
  },

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    try {
      // إذا كان التحديث يتضمن الصور، احذف الصور القديمة التي لم تعد موجودة
      if (product.images) {
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products')
          .select('images')
          .eq('id', id)
          .single()

        if (!fetchError && currentProduct?.images) {
          const oldImages = currentProduct.images || []
          const newImages = product.images || []
          const imagesToDelete = oldImages.filter(img => !newImages.includes(img))

          // احذف الصور المحذوفة من التخزين
          for (const imageUrl of imagesToDelete) {
            await storageAPI.deleteImage(imageUrl)
          }
        }
      }

      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in product update process:', error)
      return null
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      // أولاً، احصل على بيانات المنتج لحذف الصور
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching product for deletion:', fetchError)
        return false
      }

      // احذف الصور من التخزين
      if (product?.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          await storageAPI.deleteImage(imageUrl)
        }
      }

      // ثم احذف المنتج من قاعدة البيانات
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in product deletion process:', error)
      return false
    }
  }
}

export const servicesAPI = {
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
      return []
    }

    return data || []
  },

  async getFeatured(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching featured services:', error)
      return []
    }

    return data || []
  },

  async create(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single()

    if (error) {
      console.error('Error creating service:', error)
      return null
    }

    return data
  },

  async update(id: number, service: Partial<Service>): Promise<Service | null> {
    try {
      // إذا كان التحديث يتضمن الصور، احذف الصور القديمة التي لم تعد موجودة
      if (service.images) {
        const { data: currentService, error: fetchError } = await supabase
          .from('services')
          .select('images')
          .eq('id', id)
          .single()

        if (!fetchError && currentService?.images) {
          const oldImages = currentService.images || []
          const newImages = service.images || []
          const imagesToDelete = oldImages.filter(img => !newImages.includes(img))

          // احذف الصور المحذوفة من التخزين
          for (const imageUrl of imagesToDelete) {
            await storageAPI.deleteImage(imageUrl)
          }
        }
      }

      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating service:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in service update process:', error)
      return null
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      // أولاً، احصل على بيانات الخدمة لحذف الصور
      const { data: service, error: fetchError } = await supabase
        .from('services')
        .select('images')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching service for deletion:', fetchError)
        return false
      }

      // احذف الصور من التخزين
      if (service?.images && service.images.length > 0) {
        for (const imageUrl of service.images) {
          await storageAPI.deleteImage(imageUrl)
        }
      }

      // ثم احذف الخدمة من قاعدة البيانات
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting service:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in service deletion process:', error)
      return false
    }
  }
}

// Storage API for image uploads
export const storageAPI = {
  async uploadImage(file: File, path: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading image:', error)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  },

  async deleteImage(url: string): Promise<boolean> {
    try {
      if (!url || url.trim() === '') {
        return true // لا توجد صورة للحذف
      }

      // استخراج المسار من الرابط
      let path = '';

      if (url.includes('supabase')) {
        // إذا كان الرابط من Supabase
        const urlParts = url.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'images');
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          path = urlParts.slice(bucketIndex + 1).join('/');
        }
      } else {
        // طريقة بديلة لاستخراج المسار
        path = url.split('/').slice(-2).join('/');
      }

      if (!path) {
        console.error('Could not extract path from URL:', url);
        return false;
      }

      const { error } = await supabase.storage
        .from('images')
        .remove([path])

      if (error) {
        console.error('Error deleting image:', error, 'Path:', path);
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }
}

// Projects API (reused from portfolio)
export const projectsAPI = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    return data || []
  },

  async getFeatured(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching featured projects:', error)
      return []
    }

    return data || []
  },

  async getForCompany(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('show_on_company', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching company projects:', error)
      return []
    }

    return data || []
  },

  async getForPortfolio(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('show_on_portfolio', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching portfolio projects:', error)
      return []
    }

    return data || []
  },

  async getById(id: number): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }

    return data
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return null
    }

    return data
  },

  async update(id: number, project: Partial<Project>): Promise<Project | null> {
    try {
      // إذا كان التحديث يتضمن الصور، احذف الصور القديمة التي لم تعد موجودة
      if (project.images || project.image_url !== undefined) {
        const { data: currentProject, error: fetchError } = await supabase
          .from('projects')
          .select('images, image_url')
          .eq('id', id)
          .single()

        if (!fetchError && currentProject) {
          // احذف الصور المحذوفة من قائمة الصور
          if (project.images) {
            const oldImages = currentProject.images || []
            const newImages = project.images || []
            const imagesToDelete = oldImages.filter(img => !newImages.includes(img))

            for (const imageUrl of imagesToDelete) {
              await storageAPI.deleteImage(imageUrl)
            }
          }

          // احذف الصورة الرئيسية إذا تم تغييرها
          if (project.image_url !== undefined &&
              currentProject.image_url &&
              currentProject.image_url !== project.image_url) {
            await storageAPI.deleteImage(currentProject.image_url)
          }
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating project:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in project update process:', error)
      return null
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      // أولاً، احصل على بيانات المشروع لحذف الصور
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('images, image_url')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching project for deletion:', fetchError)
        return false
      }

      // احذف الصور من التخزين
      if (project?.images && project.images.length > 0) {
        for (const imageUrl of project.images) {
          await storageAPI.deleteImage(imageUrl)
        }
      }

      // احذف الصورة الرئيسية إذا كانت موجودة
      if (project?.image_url) {
        await storageAPI.deleteImage(project.image_url)
      }

      // ثم احذف المشروع من قاعدة البيانات
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting project:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in project deletion process:', error)
      return false
    }
  }
}
