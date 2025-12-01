export interface CustomizationFormData {
  logo: string;
  brandName: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    youtube: string;
    instagram: string;
  };
  sections: {
    section1: {
      image: string;
    };
    section2: {
      description: string;
      image: string;
    };
    section3: {
      description: string;
      image: string;
    };
    section4: {
      title: string;
      description: string;
      image: string;
    };
    section5: {
      testimonials: Array<{
        image: string;
        name: string;
        jobTitle: string;
        remark: string;
      }>;
    };
  };
}

// API Response Types
export interface LandingPageResponse {
  _id: string;
  tenantId: string;
  logo: string;
  brandName: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    youtube: string;
    instagram: string;
  };
  sections: {
    section1: {
      image: string;
    };
    section2: {
      description: string;
      image: string;
    };
    section3: {
      description: string;
      image: string;
    };
    section4: {
      title: string;
      description: string;
      image: string;
    };
    section5: {
      testimonials: Array<{
        image: string;
        name: string;
        jobTitle: string;
        remark: string;
      }>;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UploadImageResponse {
  url: string;
  mediaId: string;
  fileName: string;
  s3Key: string;
  updatedSection: string;
  fullLandingPage: LandingPageResponse;
}
