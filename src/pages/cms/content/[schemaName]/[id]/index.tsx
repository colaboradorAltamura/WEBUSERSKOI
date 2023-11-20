// ** Next Import
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

import DynamicSchemaLayoutEdit from 'src/views/components/dynamics/DynamicSchemaLayoutEdit';

const PathologiesEdit = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** Hooks
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const schemaName = router.query.schemaName as string;
  const id = router.query.id as string;

  if (!schemaName || !id) {
    console.error('missing args', router);
    router.push('/500');
  }

  return <DynamicSchemaLayoutEdit id={id} schemaName={schemaName} panels={null} useCmsRoutes={true} />;
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
      id: params?.id,

      // tab: params?.tab,
    },
  };
};

export default PathologiesEdit;
