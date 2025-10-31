/**
 * Unsplash Image Helper
 * 
 * Uses Unsplash Source API for easy image integration
 * No API key required for basic usage
 */

export interface UnsplashImageOptions {
  width?: number;
  height?: number;
  query?: string;
  featured?: boolean;
  random?: boolean;
}

/**
 * Get Unsplash image URL
 * 
 * @param options - Image options
 * @returns Unsplash image URL
 * 
 * @example
 * getUnsplashImage({ width: 800, height: 600, query: 'crossfit' })
 * // Returns: https://source.unsplash.com/800x600/?crossfit
 */
export function getUnsplashImage(options: UnsplashImageOptions = {}): string {
  const {
    width = 1200,
    height = 800,
    query = '',
    featured = false,
    random = false,
  } = options;

  const baseUrl = 'https://source.unsplash.com';
  const size = `${width}x${height}`;
  
  if (featured) {
    return `${baseUrl}/featured/${size}${query ? `/?${query}` : ''}`;
  }
  
  if (random) {
    return `${baseUrl}/random/${size}${query ? `/?${query}` : ''}`;
  }
  
  return `${baseUrl}/${size}${query ? `/?${query}` : ''}`;
}

/**
 * Predefined Unsplash images for G3 CrossFit
 */
export const unsplashImages = {
  // Training Programs
  crossfit: {
    main: getUnsplashImage({ width: 1200, height: 800, query: 'crossfit,workout,gym' }),
    hero: getUnsplashImage({ width: 1920, height: 1080, query: 'crossfit,athlete,training' }),
    workout: getUnsplashImage({ width: 800, height: 600, query: 'crossfit,wod,fitness' }),
  },
  
  weightlifting: {
    main: getUnsplashImage({ width: 1200, height: 800, query: 'weightlifting,barbell,olympic' }),
    snatch: getUnsplashImage({ width: 800, height: 600, query: 'snatch,weightlifting' }),
    cleanJerk: getUnsplashImage({ width: 800, height: 600, query: 'clean and jerk,weightlifting' }),
  },
  
  strength: {
    main: getUnsplashImage({ width: 1200, height: 800, query: 'strength training,powerlifting' }),
    squat: getUnsplashImage({ width: 800, height: 600, query: 'squat,strength' }),
    deadlift: getUnsplashImage({ width: 800, height: 600, query: 'deadlift,powerlifting' }),
  },
  
  // Gym & Facility
  gym: {
    interior: getUnsplashImage({ width: 1200, height: 800, query: 'gym,interior,crossfit box' }),
    equipment: getUnsplashImage({ width: 800, height: 600, query: 'gym equipment,rogue fitness' }),
    facility: getUnsplashImage({ width: 1920, height: 1080, query: 'crossfit gym,facility' }),
  },
  
  // Community & People
  community: {
    group: getUnsplashImage({ width: 1200, height: 800, query: 'crossfit,group,community' }),
    teamwork: getUnsplashImage({ width: 800, height: 600, query: 'fitness,teamwork,motivation' }),
    celebration: getUnsplashImage({ width: 800, height: 600, query: 'fitness,success,celebration' }),
  },
  
  // Coaches (Athletic portraits)
  coaches: {
    male1: getUnsplashImage({ width: 400, height: 400, query: 'fitness coach,male,portrait' }),
    male2: getUnsplashImage({ width: 400, height: 400, query: 'personal trainer,male,athletic' }),
    female1: getUnsplashImage({ width: 400, height: 400, query: 'fitness coach,female,portrait' }),
    female2: getUnsplashImage({ width: 400, height: 400, query: 'personal trainer,female,athletic' }),
  },
  
  // Testimonials (Before/After style)
  testimonials: {
    transformation1: getUnsplashImage({ width: 400, height: 400, query: 'fitness,transformation,athlete' }),
    transformation2: getUnsplashImage({ width: 400, height: 400, query: 'crossfit,athlete,strong' }),
    transformation3: getUnsplashImage({ width: 400, height: 400, query: 'fitness,success,healthy' }),
    transformation4: getUnsplashImage({ width: 400, height: 400, query: 'workout,athlete,fit' }),
  },
  
  // Hero Section
  hero: {
    main: getUnsplashImage({ width: 1920, height: 1080, query: 'crossfit,intense,workout' }),
    background: getUnsplashImage({ width: 1920, height: 1080, query: 'gym,dark,moody' }),
  },
  
  // About Section
  about: {
    story: getUnsplashImage({ width: 1200, height: 800, query: 'crossfit,community,berlin' }),
    mission: getUnsplashImage({ width: 800, height: 600, query: 'fitness,motivation,teamwork' }),
  },
};

/**
 * Get optimized Unsplash image URL with Next.js Image component support
 * 
 * @param query - Search query
 * @param width - Image width
 * @param height - Image height
 * @returns Optimized image URL
 */
export function getOptimizedUnsplashImage(
  query: string,
  width: number = 1200,
  height: number = 800
): string {
  // Use Unsplash's CDN with specific dimensions
  return `https://images.unsplash.com/photo-${Date.now()}?w=${width}&h=${height}&fit=crop&q=80&auto=format&${query}`;
}

/**
 * Alternative: Use specific Unsplash photo IDs for consistent images
 * This ensures the same images are always loaded
 */
export const specificUnsplashPhotos = {
  // CrossFit Training
  crossfitMain: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop&q=80',
  crossfitWorkout: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop&q=80',
  
  // Weightlifting
  weightliftingMain: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&h=800&fit=crop&q=80',
  barbell: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop&q=80',
  
  // Strength Training
  strengthMain: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&h=800&fit=crop&q=80',
  squat: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=1200&h=800&fit=crop&q=80',
  
  // Gym Interior
  gymInterior: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop&q=80',
  gymEquipment: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=800&fit=crop&q=80',
  
  // Community
  communityGroup: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop&q=80',
  teamwork: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop&q=80',
  
  // Coaches
  coachMale1: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&q=80',
  coachMale2: 'https://images.unsplash.com/photo-1567598508481-65985588e295?w=400&h=400&fit=crop&q=80',
  coachFemale1: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop&q=80',
  
  // Hero
  heroMain: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&q=80',
  
  // About
  aboutStory: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop&q=80',

  // Testimonials - Transformation Photos
  transformation1: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop&q=80',
  transformation2: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&q=80',
  transformation3: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&q=80',
  transformation4: 'https://images.unsplash.com/photo-1567598508481-65985588e295?w=400&h=400&fit=crop&q=80',
};

