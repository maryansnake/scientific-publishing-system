import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';

// Main Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Journal Pages
import JournalList from './pages/Journals/JournalList';
import JournalDetail from './pages/Journals/JournalDetail';

// Article Pages
import ArticleList from './pages/Articles/ArticleList';
import ArticleDetail from './pages/Articles/ArticleDetail';
import ArticleCreate from './pages/Articles/ArticleCreate';
import ArticleEdit from './pages/Articles/ArticleEdit';
import MyArticles from './pages/Articles/MyArticles';

// Settings Page
import Settings from './pages/Settings';
import ReviewList from "./pages/Reviews/ReviewList";
import NewReview from "./pages/Reviews/NewReview";
import ReviewDetail from "./pages/Reviews/ReviewDetail";
import CompleteReview from "./pages/Reviews/CompleteReview";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Main Layout with Protected Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            
            {/* Journals - Public Routes */}
            <Route path="journals" element={<JournalList />} />
            <Route path="journals/:slug" element={<JournalDetail />} />
            
            {/* Articles - Public Routes */}
            <Route path="articles" element={<ArticleList />} />
            <Route path="articles/:id" element={<ArticleDetail />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="my-articles" element={<MyArticles />} />
              <Route path="articles/create" element={<ArticleCreate />} />
              <Route path="articles/:id/edit" element={<ArticleEdit />} />
              <Route path="settings" element={<Settings />} />

              <Route path="reviews">
                <Route index element={<ReviewList/>}/>
                <Route path="create" element={<NewReview/>}/>
                <Route path=":id" element={<ReviewDetail/>}/>
                <Route path="complete/:id" element={<CompleteReview/>}/>
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;