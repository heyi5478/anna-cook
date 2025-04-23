import { NextPage } from 'next';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AuthorProfile from '@/components/AuthorProfile';
import { mockAuthor, mockRecipes } from '@/components/AuthorProfile/types';

const AuthorProfilePage: NextPage = () => {
  return (
    <>
      <Header />
      <AuthorProfile author={mockAuthor} recipes={mockRecipes} />
      <Footer />
    </>
  );
};

export default AuthorProfilePage;
