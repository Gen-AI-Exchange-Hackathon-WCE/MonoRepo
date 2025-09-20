enum UserRole {
  CUSTOMER,
  ARTIST,
  ADMIN,
}

export interface ProfileDescriptionGenerationRequest {
  profession: string;
  location: string;
  background: string;
  experience: string;
  custom_request: string | null;
  previous_descriptions: string[] | null;
}

export interface ProfileDescriptionGenerationResponse {
  description: string;
  plain_text: string;
}

export interface ProductDescriptionGenerationRequest {
  profession: string;
  product_name: string;
  custom_req: string | null;
  location: string;
  product_description: string;
  background: string;
}

export interface ProductImageGenerationRequest {
  art_form: string;
  product_image_url: string;
  product_description: string | null;
}

export interface ProductKeywordGenerationRequest {
  profession: string;
  product_name: string;
  location: string;
  artist_name: string;
  product_description: string | null;
}

export interface CreateCourseRequest {
  artistId: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

export interface UploadVideoToCourseRequest {
  courseId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  url: string;
}

export interface SearchVideoOrCourseRequest {
  query?: string;         
  courseName?: string;    
  videoTitle?: string;   
  artistName?: string;    
  tags?: string[];
}