import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import BookDetailPage from "./pages/BookDetailPage";
import ClubsPage from "./features/clubs/pages/ClubsPage";
import ClubDetailPage from "./features/clubs/pages/ClubDetailPage";
import RecruitmentListPage from "./features/recruitments/pages/RecruitmentListPage";
import RecruitmentDetailPage from "./features/recruitments/pages/RecruitmentDetailPage";
import DiscussionCreatePage from "./features/discussions/pages/DiscussionCreatePage";
import DiscussionListPage from "./features/discussions/pages/DiscussionListPage";
import DiscussionDetailPage from "./features/discussions/pages/DiscussionDetailPage";
import DiscussionEditPage from "./features/discussions/pages/DiscussionEditPage";
import ClubReviewListPage from "./features/reviews/pages/ClubReviewListPage";
import MyReviewListPage from "./features/reviews/pages/MyReviewListPage";
import ReviewCreatePage from "./features/reviews/pages/ReviewCreatePage";
import ReviewDetailPage from "./features/reviews/pages/ReviewDetailPage";
import ReviewListPage from "./features/reviews/pages/ReviewListPage";
import LoginPage from "./features/auth/pages/LoginPage";
import SignupCompletePage from "./features/auth/pages/SignupCompletePage";
import MyClubsPage from "./features/my-clubs/pages/MyClubsPage";
import MyPage from "./features/mypage/pages/MyPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/books/:isbn13" element={<BookDetailPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
        <Route path="/recruitments" element={<RecruitmentListPage />} />
        <Route path="/recruitments/:recruitmentId" element={<RecruitmentDetailPage />} />
        <Route path="/clubs/:clubId/discussions/new" element={<DiscussionCreatePage />} />
        <Route path="/clubs/:clubId/discussions" element={<DiscussionListPage />} />
        <Route path="/discussions/:discussionId/edit" element={<DiscussionEditPage />} />
        <Route path="/discussions/:discussionId" element={<DiscussionDetailPage />} />
        <Route path="/clubs/:clubId/reviews" element={<ClubReviewListPage />} />
        <Route path="/clubs/:clubId/reviews/new" element={<ReviewCreatePage />} />
        <Route path="/reviews" element={<ReviewListPage />} />
        <Route path="/reviews/:reviewId" element={<ReviewDetailPage />} />
        <Route path="/users/me/reviews" element={<MyReviewListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
        <Route path="/my-clubs" element={<MyClubsPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
