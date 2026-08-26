export const CURRENT_USER_ID = "student-demo-01";

export interface Campus {
  id: string;
  name: string;
  locations: Location[];
}

export interface Location {
  id: string;
  name: string;
}

export interface AskPayload {
  question: string;
  campus_id: string;
  location_id: string;
  requester_id: string;
}

export interface AskResponse {
  status: "verified" | "low_confidence" | "pending" | "error";
  routing: {
    campus_name: string;
    location_name: string;
    location_id: string;
  };
  verification: {
    answer: string;
    confidence_score: number;
    evidence_used: string[];
    warning?: string;
  };
  request_id: string;
}

export interface VolunteerProfile {
  user_id: string;
  name: string;
  points: number;
  trust_score: number;
  verified_contributions: number;
  recent_contributions: ContributionItem[];
  volunteer_hours?: number;
  volunteer_status?: "pending" | "approved" | "rejected";
}

export interface ContributionItem {
  id: string;
  location: string;
  description: string;
  points: number;
  timestamp: string;
}

export interface ReviewItem {
  id: string;
  request_id: string;
  user_id: string;
  location_name: string;
  question: string;
  confidence: number;
  agent_recommendation: string;
  status: "pending" | "approved" | "rejected" | "revision_requested";
  created_at: string;
}

export interface ReviewDecision {
  reviewer_id: string;
  decision: "approved" | "rejected" | "revision";
  feedback: string;
}

export const CAMPUSES: Campus[] = [
  {
    id: "female-faisaliyah",
    name: "شطر الطالبات - فرع الفيصلية",
    locations: [
      { id: "ff-14", name: "مبنى 14" },
      { id: "ff-1", name: "مبنى 1" },
      { id: "ff-5", name: "مبنى 5" },
      { id: "ff-3", name: "مبنى الأمير عبدالمجيد (3)" },
      { id: "ff-sci", name: "معامل كلية العلوم" },
      { id: "ff-nursery", name: "الحضانة" },
      { id: "ff-9", name: "مبنى 9 - عمادة القبول والتسجيل" },
      { id: "ff-11", name: "مبنى 11 - كلية علوم وهندسة الحاسب" },
      { id: "ff-12", name: "مبنى 12 - مركز التعلم الإلكتروني والتعليم عن بعد" },
      { id: "ff-17", name: "مبنى 17" },
      { id: "ff-conf", name: "مركز المؤتمرات" },
      { id: "ff-jow", name: "قاعة الأميرة الجوهرة" },
    ],
  },
  {
    id: "female-rahab",
    name: "شطر الطالبات - فرع الرحاب",
    locations: [
      { id: "fr-design", name: "كلية التصاميم والفنون" },
    ],
  },
  {
    id: "health-sharfia",
    name: "مقر التخصصات الصحية - فرع الشرفية",
    locations: [
      { id: "hs-med", name: "كلية الطب" },
      { id: "hs-ams", name: "كلية العلوم الطبية التطبيقية" },
    ],
  },
  {
    id: "male-asfan",
    name: "شطر الطلاب - فرع عسفان",
    locations: [
      { id: "ma-19", name: "مبنى 19" },
      { id: "ma-20", name: "مبنى 20" },
      { id: "ma-21", name: "مبنى 21" },
      { id: "ma-16", name: "مبنى 16" },
      { id: "ma-18", name: "مبنى 18" },
      { id: "ma-2", name: "مبنى 2 - المركز الطبي الجامعي" },
      { id: "ma-4", name: "مبنى 4 - السنة التحضيرية" },
      { id: "ma-1", name: "مبنى 1 - عمادة الدراسات العليا" },
      { id: "ma-3", name: "مبنى 3" },
      { id: "ma-6", name: "مبنى 6" },
      { id: "ma-8", name: "مبنى 8" },
      { id: "ma-10", name: "مبنى 10" },
      { id: "ma-12", name: "مبنى 12 - عمادة القبول والتسجيل" },
      { id: "ma-13", name: "مبنى 13" },
      { id: "ma-5", name: "مبنى 5 - عمادة شؤون الطلاب" },
      { id: "ma-9", name: "مبنى 9 - معامل كلية العلوم" },
      { id: "ma-sports", name: "الملاعب الرياضية" },
      { id: "ma-admin", name: "مبنى الإدارة العامة" },
      { id: "ma-hi-admin", name: "مبنى الإدارة العليا" },
      { id: "ma-cs-biz", name: "مبنى كلية علوم وهندسة الحاسب وكلية الأعمال" },
    ],
  },
  {
    id: "male-faisaliyah",
    name: "شطر الطلاب - فرع الفيصلية",
    locations: [
      { id: "mf-a", name: "مبنى أ" },
      { id: "mf-b", name: "مبنى ب" },
      { id: "mf-admin", name: "مبنى الإدارة والكليات" },
      { id: "mf-mosque", name: "المسجد" },
    ],
  },
  {
    id: "male-khulais",
    name: "شطر الطلاب - فرع خليص",
    locations: [
      { id: "mk-main", name: "مقر فرع خليص - شطر الطلاب" },
    ],
  },
  {
    id: "female-khulais",
    name: "شطر الطالبات - فرع خليص",
    locations: [
      { id: "fk-main", name: "مقر فرع خليص - شطر الطالبات" },
    ],
  },
  {
    id: "male-kamil",
    name: "شطر الطلاب - فرع الكامل",
    locations: [
      { id: "mk2-main", name: "مقر فرع الكامل - شطر الطلاب" },
    ],
  },
];

export const QUICK_QUESTIONS = [
  "هل المكان مزدحم الآن؟",
  "هل توجد أماكن متاحة؟",
  "هل يوجد انتظار طويل؟",
  "هل يوجد أحد يستطيع مساعدتي؟",
  "هل توجد مفقودات هنا؟",
];

export const DEMO_LOST_ITEMS = [
  { id: "l1", name: "سماعات AirPods", location: "مبنى 11 - فرع الفيصلية", status: "lost" as const, time: "منذ ساعة" },
  { id: "l2", name: "بطاقة جامعية", location: "مبنى 17 - فرع الفيصلية", status: "found" as const, time: "منذ 3 ساعات" },
  { id: "l3", name: "حقيبة يد", location: "فرع الشرفية", status: "lost" as const, time: "منذ يوم" },
];

export const DEMO_LIVE_LOCATIONS = [
  { id: "l1", name: "مبنى 11", sub: "كلية علوم وهندسة الحاسب", updates: 3, badge: "معلومات متاحة" },
  { id: "l2", name: "الخدمات الطلابية", sub: "مبنى 5 - عسفان", updates: 2, badge: "نشط" },
  { id: "l3", name: "مبنى الإدارة", sub: "فرع الفيصلية", updates: 1, badge: "هادئ" },
  { id: "l4", name: "قاعة الأميرة الجوهرة", sub: "فرع الفيصلية", updates: 4, badge: "نشط" },
];
