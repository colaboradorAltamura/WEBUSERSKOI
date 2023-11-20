// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

// ** Third Party Imports

// ** Types

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage';

import { useRouter } from 'next/router';

const UserView = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const tab = 'account';

  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const id = router.query.id as string;

  if (!id) {
    console.error('missing args', router);
    router.push('/500');
  }

  const tab = router.query['tab'] as string;

  return <UserViewPage tab={tab} userId={id} />;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id,

      // tab: params?.tab,
    },
  };
};

export default UserView;
