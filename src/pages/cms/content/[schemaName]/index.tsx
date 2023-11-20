// ** Next Import
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next/types';

// ** React Imports
import Loader from 'src/@core/components/loader';
import { USERS_SCHEMA } from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

import { useDynamics } from 'src/hooks/useDynamics';
import DynamicSchemaLayoutList from 'src/views/components/dynamics/DynamicSchemaLayoutList';

interface Props {
  schemaName: string;
}

const CMSContent = ({}: Props) => {
  // ** Hooks
  const router = useRouter();
  const currentUserContext = useCurrentUser();

  if (currentUserContext.isLoading) return <Loader />;

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const schemaName = router.query.schemaName as string;

  if (!schemaName) {
    console.error('missing args', router);
    router.push('/500');
  }

  return (
    <DynamicSchemaLayoutList
      useCmsRoutes={true}
      // No se lo paso para que no haga consultas por usuario
      // parentEntitySchema={USERS_SCHEMA}
      // parentEntityData={currentUserContext.currentUser}
      schemaName={schemaName}
    />
  );
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
      schemaName: params?.schemaName,

      // tab: params?.tab,
    },
  };
};

export default CMSContent;
