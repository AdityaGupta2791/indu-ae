export interface CreateCourseDTO {
  subjectId: string;
  gradeId: string;
  name: string;
  description?: string;
}

export interface UpdateCourseDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CourseSearchQuery {
  page?: string;
  limit?: string;
  subject?: string;
  grade?: string;
  search?: string;
}

export interface CreateCourseMaterialDTO {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSizeKb?: number;
}

export interface UpdateGradeTierDTO {
  name?: string;
  creditsPerClass?: number;
}

export interface AssignTutorToCourseDTO {
  tutorId: string;
}
