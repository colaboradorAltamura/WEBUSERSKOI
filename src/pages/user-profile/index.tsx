// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

// ** Third Party Imports

// ** Demo Components Imports
import UserProfile from 'src/views/pages/user-profile/UserProfile';

// ** Types

const UserProfilePage = () => {
  return <UserProfile />;
};

export default UserProfilePage;
