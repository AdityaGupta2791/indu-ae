import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Auth Pages
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ForceChangePassword from "@/pages/auth/ForceChangePassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Dashboard Pages
import UserDashboard from "@/pages/dashboard/UserDashboard";
import EnrolledClasses from "@/pages/dashboard/EnrolledClasses";
import SavedClasses from "@/pages/dashboard/SavedClasses";
import UserProfile from "@/pages/dashboard/UserProfile";
import AccountSettings from "@/pages/dashboard/AccountSettings";
import StudentAssessments from "@/pages/dashboard/StudentAssessments";
import StudentMessages from "@/pages/dashboard/StudentMessages";
import StudentHelp from "@/pages/dashboard/StudentHelp";

// Tutor Dashboard Pages
import TutorDashboard from "@/pages/tutor-dashboard/TutorDashboard";
import MyClasses from "@/pages/tutor-dashboard/MyClasses";
import ClassDetails from "@/pages/tutor-dashboard/ClassDetails";
import Earnings from "@/pages/tutor-dashboard/Earnings";
import Messages from "@/pages/tutor-dashboard/Messages";
import Feedback from "@/pages/tutor-dashboard/Feedback";
import TutorDemoRequests from "@/pages/tutor-dashboard/TutorDemoRequests";
import TutorAssessments from "@/pages/tutor-dashboard/TutorAssessments";
import TutorProfile from "@/pages/tutor-dashboard/TutorProfile";
import TutorAvailability from "@/pages/tutor-dashboard/TutorAvailability";
import TutorSettings from "@/pages/tutor-dashboard/TutorSettings";
import TutorCourseMaterials from "@/pages/tutor-dashboard/TutorCourseMaterials";
import TutorBookings from "@/pages/tutor-dashboard/TutorBookings";
import TutorEnrollments from "@/pages/tutor-dashboard/TutorEnrollments";
import TutorRecordingsPage from "@/pages/tutor-dashboard/TutorRecordingsPage";
import TutorBatches from "@/pages/tutor-dashboard/TutorBatches";
import TutorBatchDetail from "@/pages/tutor-dashboard/TutorBatchDetail";
import TutorEnrollmentDetail from "@/pages/tutor-dashboard/TutorEnrollmentDetail";

// Public Pages
import DemoRequestPublic from "@/pages/DemoRequestPublic";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import HowItWorksPage from "@/pages/HowItWorks";
import Tutors from "@/pages/Tutors";

// Explore Pages
import AcademicSubjects from "@/pages/explore/AcademicSubjects";
import ArtsCreativity from "@/pages/explore/ArtsCreativity";
import LifeSkills from "@/pages/explore/LifeSkills";
import TechnologyCoding from "@/pages/explore/TechnologyCoding";

// How It Works Pages
import ClassFormats from "@/pages/how-it-works/ClassFormats";
import ForParents from "@/pages/how-it-works/ForParents";
import SafetyQuality from "@/pages/how-it-works/SafetyQuality";

// For Tutors Pages
import BecomeTutor from "@/pages/for-tutors/BecomeTutor";
import SuccessStories from "@/pages/for-tutors/SuccessStories";
import TutorResources from "@/pages/for-tutors/TutorResources";

// For Consultants Pages
import BecomeConsultant from "@/pages/for-consultants/BecomeConsultant";
import ConsultantSuccessStories from "@/pages/for-consultants/SuccessStories";
import ConsultantResources from "@/pages/for-consultants/ConsultantResources";

// Parent Dashboard Pages
import ParentDashboard from "@/pages/parent-dashboard/ParentDashboard";
import MyChildren from "@/pages/parent-dashboard/MyChildren";
import FindTutors from "@/pages/parent-dashboard/FindTutors";
import ParentDemoRequests from "@/pages/parent-dashboard/DemoRequests";
import Credits from "@/pages/parent-dashboard/Credits";
import ParentEnrolledClasses from "@/pages/parent-dashboard/ParentEnrolledClasses";
import ParentRecordings from "@/pages/parent-dashboard/ParentRecordings";
import ParentAssessments from "@/pages/parent-dashboard/ParentAssessments";
import ParentSettings from "@/pages/parent-dashboard/ParentSettings";
import ParentMessages from "@/pages/parent-dashboard/ParentMessages";
import ParentBookings from "@/pages/parent-dashboard/ParentBookings";
import NewEnrollment from "@/pages/parent-dashboard/NewEnrollment";
import EnrollmentDetail from "@/pages/parent-dashboard/EnrollmentDetail";
import BrowseBatches from "@/pages/parent-dashboard/BrowseBatches";
import BatchDetail from "@/pages/parent-dashboard/BatchDetail";
import MyBatches from "@/pages/parent-dashboard/MyBatches";

// Consultant Dashboard Pages
import ConsultantDashboard from "@/pages/consultant-dashboard/ConsultantDashboard";
import TutorAllocations from "@/pages/consultant-dashboard/TutorAllocations";
import ConsultantMessages from "@/pages/consultant-dashboard/Messages";
import ConsultantFeedback from "@/pages/consultant-dashboard/Feedback";
import DemoRequests from "@/pages/consultant-dashboard/DemoRequests";
import ConsultantEarnings from "@/pages/consultant-dashboard/Earnings";
import ConsultantSettings from "@/pages/consultant-dashboard/ConsultantSettings";
import ConsultantDemoBookings from "@/pages/consultant-dashboard/DemoBookings";

// Resources Pages
import BlogArticles from "@/pages/resources/BlogArticles";
import HelpCenter from "@/pages/resources/HelpCenter";
import LearningGuides from "@/pages/resources/LearningGuides";

// Class Pages
import BookClass from "@/pages/classes/BookClass";
import { default as PublicClassDetails } from "@/pages/classes/ClassDetails";

// Admin Pages
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import ClassManagement from "@/pages/admin/ClassManagement";
import PaymentManagement from "@/pages/admin/PaymentManagement";
import SystemSettings from "@/pages/admin/SystemSettings";
import Analytics from "@/pages/admin/Analytics";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import TutorManagement from "@/pages/admin/TutorManagement";
import AdminDemoRequests from "@/pages/admin/AdminDemoRequests";
import AdminDemoBookings from "@/pages/admin/AdminDemoBookings";
import AdminApplications from "@/pages/admin/AdminApplications";
import AdminEnrollments from "@/pages/admin/AdminEnrollments";
import AdminBatches from "@/pages/admin/AdminBatches";
import AdminEarnings from "@/pages/admin/AdminEarnings";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminAssessments from "@/pages/admin/AdminAssessments";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home — redirect to dashboard if logged in */}
      <Route path="/" element={<RedirectIfAuthenticated><Index /></RedirectIfAuthenticated>} />

      {/* Auth — redirect to dashboard if logged in */}
      <Route path="/auth/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
      <Route path="/auth/signup" element={<RedirectIfAuthenticated><SignUp /></RedirectIfAuthenticated>} />
      <Route path="/auth/forgot-password" element={<RedirectIfAuthenticated><ForgotPassword /></RedirectIfAuthenticated>} />
      {/* Public demo form (accessible with or without login) */}
      <Route path="/book-demo" element={<DemoRequestPublic />} />

      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/force-change-password" element={<ForceChangePassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      
      {/* Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={<ProtectedRoute requiredRole="student"><UserDashboard /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/profile"
        element={<ProtectedRoute requiredRole="student"><UserProfile /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/enrolled-classes"
        element={<ProtectedRoute requiredRole="student"><EnrolledClasses /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/saved-classes"
        element={<ProtectedRoute requiredRole="student"><SavedClasses /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/assessments"
        element={<ProtectedRoute requiredRole="student"><StudentAssessments /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/messages"
        element={<ProtectedRoute requiredRole="student"><StudentMessages /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/settings"
        element={<ProtectedRoute requiredRole="student"><AccountSettings /></ProtectedRoute>}
      />
      <Route
        path="/student-dashboard/help"
        element={<ProtectedRoute requiredRole="student"><StudentHelp /></ProtectedRoute>}
      />
      
      {/* Parent Dashboard */}
      <Route
        path="/parent-dashboard"
        element={<ProtectedRoute requiredRole="parent"><ParentDashboard /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/children"
        element={<ProtectedRoute requiredRole="parent"><MyChildren /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/find-tutors"
        element={<ProtectedRoute requiredRole="parent"><FindTutors /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/demo-requests"
        element={<ProtectedRoute requiredRole="parent"><ParentDemoRequests /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/bookings"
        element={<ProtectedRoute requiredRole="parent"><ParentBookings /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/credits"
        element={<ProtectedRoute requiredRole="parent"><Credits /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/enrolled-classes"
        element={<ProtectedRoute requiredRole="parent"><ParentEnrolledClasses /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/recordings"
        element={<ProtectedRoute requiredRole="parent"><ParentRecordings /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/batches"
        element={<ProtectedRoute requiredRole="parent"><BrowseBatches /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/batches/:id"
        element={<ProtectedRoute requiredRole="parent"><BatchDetail /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/my-batches"
        element={<ProtectedRoute requiredRole="parent"><MyBatches /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/enrollments/new"
        element={<ProtectedRoute requiredRole="parent"><NewEnrollment /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/enrollments/:id"
        element={<ProtectedRoute requiredRole="parent"><EnrollmentDetail /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/assessments"
        element={<ProtectedRoute requiredRole="parent"><ParentAssessments /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/messages"
        element={<ProtectedRoute requiredRole="parent"><ParentMessages /></ProtectedRoute>}
      />
      <Route
        path="/parent-dashboard/settings"
        element={<ProtectedRoute requiredRole="parent"><ParentSettings /></ProtectedRoute>}
      />

      {/* Tutor Dashboard */}
      <Route
        path="/tutor-dashboard"
        element={<ProtectedRoute requiredRole="tutor"><TutorDashboard /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/earnings"
        element={<ProtectedRoute requiredRole="tutor"><Earnings /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/classes"
        element={<ProtectedRoute requiredRole="tutor"><MyClasses /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/classes/:id"
        element={<ProtectedRoute requiredRole="tutor"><ClassDetails /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/messages"
        element={<ProtectedRoute requiredRole="tutor"><Messages /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/feedback"
        element={<ProtectedRoute requiredRole="tutor"><Feedback /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/demo-requests"
        element={<ProtectedRoute requiredRole="tutor"><TutorDemoRequests /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/bookings"
        element={<ProtectedRoute requiredRole="tutor"><TutorBookings /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/enrollments"
        element={<ProtectedRoute requiredRole="tutor"><TutorEnrollments /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/recordings"
        element={<ProtectedRoute requiredRole="tutor"><TutorRecordingsPage /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/batches"
        element={<ProtectedRoute requiredRole="tutor"><TutorBatches /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/batches/:id"
        element={<ProtectedRoute requiredRole="tutor"><TutorBatchDetail /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/enrollments/:id"
        element={<ProtectedRoute requiredRole="tutor"><TutorEnrollmentDetail /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/assessments"
        element={<ProtectedRoute requiredRole="tutor"><TutorAssessments /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/profile"
        element={<ProtectedRoute requiredRole="tutor"><TutorProfile /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/availability"
        element={<ProtectedRoute requiredRole="tutor"><TutorAvailability /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/course-materials"
        element={<ProtectedRoute requiredRole="tutor"><TutorCourseMaterials /></ProtectedRoute>}
      />
      <Route
        path="/tutor-dashboard/settings"
        element={<ProtectedRoute requiredRole="tutor"><TutorSettings /></ProtectedRoute>}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="tutors" element={<TutorManagement />} />
        <Route path="demo-requests" element={<AdminDemoRequests />} />
        <Route path="demo-bookings" element={<AdminDemoBookings />} />
        <Route path="enrollments" element={<AdminEnrollments />} />
        <Route path="batches" element={<AdminBatches />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="earnings" element={<AdminEarnings />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="assessment-results" element={<AdminAssessments />} />
      </Route>
      
      {/* M13: CMS Public Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/tutors" element={<Tutors />} />

      {/* Explore */}
      <Route path="/explore/academic-subjects" element={<AcademicSubjects />} />
      <Route path="/explore/arts-creativity" element={<ArtsCreativity />} />
      <Route path="/explore/life-skills" element={<LifeSkills />} />
      <Route path="/explore/technology-coding" element={<TechnologyCoding />} />
      
      {/* How It Works */}
      <Route path="/how-it-works/class-formats" element={<ClassFormats />} />
      <Route path="/how-it-works/for-parents" element={<ForParents />} />
      <Route path="/how-it-works/safety-quality" element={<SafetyQuality />} />
      
      {/* For Tutors */}
      <Route path="/for-tutors/become-tutor" element={<BecomeTutor />} />
      <Route path="/for-tutors/success-stories" element={<SuccessStories />} />
      <Route path="/for-tutors/tutor-resources" element={<TutorResources />} />

      {/* For Consultants */}
      <Route path="/for-consultants/become-consultant" element={<BecomeConsultant />} />
      <Route path="/for-consultants/success-stories" element={<ConsultantSuccessStories />} />
      <Route path="/for-consultants/consultant-resources" element={<ConsultantResources />} />

      {/* Consultant Dashboard */}
      <Route
        path="/consultant-dashboard"
        element={<ProtectedRoute requiredRole="consultant"><ConsultantDashboard /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/demo-requests"
        element={<ProtectedRoute requiredRole="consultant"><DemoRequests /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/demo-bookings"
        element={<ProtectedRoute requiredRole="consultant"><ConsultantDemoBookings /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/allocations"
        element={<ProtectedRoute requiredRole="consultant"><TutorAllocations /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/messages"
        element={<ProtectedRoute requiredRole="consultant"><ConsultantMessages /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/feedback"
        element={<ProtectedRoute requiredRole="consultant"><ConsultantFeedback /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/earnings"
        element={<ProtectedRoute requiredRole="consultant"><ConsultantEarnings /></ProtectedRoute>}
      />
      <Route
        path="/consultant-dashboard/settings"
        element={<ProtectedRoute requiredRole="consultant"><ConsultantSettings /></ProtectedRoute>}
      />

      {/* Resources */}
      <Route path="/resources/blog-articles" element={<BlogArticles />} />
      <Route path="/resources/help-center" element={<HelpCenter />} />
      <Route path="/resources/learning-guides" element={<LearningGuides />} />
      
      {/* Classes */}
      <Route path="/classes/:id" element={<PublicClassDetails />} />
      <Route path="/classes/:id/book" element={<BookClass />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
