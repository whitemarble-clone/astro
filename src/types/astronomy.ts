export type UserRole = 'member' | 'admin';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'course' | 'event' | 'quiz' | 'honorary';
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  earnedAt?: string;
}

export interface SocietyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  targetObject: string;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  registeredMembers: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseQuiz {
  courseId: number;
  title: string;
  passingScore: number; // e.g. 70
  questions: QuizQuestion[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberId: string;
  avatar: string; // Emoji avatar or fallback
  photoUrl?: string; // Custom uploaded profile picture
  bio?: string;
  callsign?: string;
  joinedDate: string;
  tier: 'Standard Fellow' | 'Senior Researcher' | 'Observatory Director';
  badges: string[]; // Badge IDs
  eventParticipations: string[]; // Event IDs
  quizScores: Record<number, number>; // courseId -> percentage score
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  videoSource?: 'upload' | 'youtube' | 'vimeo' | 'direct' | 'url';
  videoFileName?: string;
  description: string;
  targetObject?: string;
  coordinates?: {
    ra: string; // Right Ascension e.g. 05h 35m 17s
    dec: string; // Declination e.g. -05° 23′ 28″
    constellation: string;
  };
  keyTakeaways?: string[];
  resources?: { name: string; type: string; size: string }[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'Introductory' | 'Intermediate' | 'Advanced';
  leadAstronomer: {
    name: string;
    affiliation: string;
    callsign: string;
  };
  thumbnail?: string;
  lessons: Lesson[];
  learningSubjects?: string[]; // What students learn in this course
  customCertificateTemplateUrl?: string; // Optional custom certificate template for this course
  quiz?: CourseQuiz;
}

export interface CertificateSettings {
  societyName: string;
  facultyName: string;
  certificateTitle: string;
  citationBody: string;
  signatory1Name: string;
  signatory1Title: string;
  signatory2Name: string;
  signatory2Title: string;
  sealText: string;
  sealYear: string;
}

export interface CustomCertificate {
  id: string;
  courseId?: number;
  courseTitle: string;
  recipientName: string;
  memberId: string;
  issueDate: string;
  certificateNumber: string;
  fileUrl?: string; // base64 or blob URL
  fileName?: string;
  fileType?: 'image' | 'pdf';
  isTemplate?: boolean;
  templateImageUrl?: string;
  notes?: string;
  issuerOrg?: string;
  uploadedBy: string;
  verified: boolean;
}

export interface ObservationEntry {
  id: string;
  timestamp: string;
  target: string;
  catalogueId: string;
  magnitude: number;
  equipment: string;
  skyCondition: 'Pristine (Bortle 1-2)' | 'Rural (Bortle 3-4)' | 'Suburban (Bortle 5-6)' | 'Urban (Bortle 7-8)';
  notes: string;
  verified: boolean;
}

export interface SocietyDataLocation {
  folderPath: string;
  lastExported?: string;
  totalRecordsCount: number;
  storageSizeBytes: number;
}
