// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

import DynamicSchemaLayoutEdit from 'src/views/components/dynamics/DynamicSchemaLayoutEdit';

const PathologiesEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <DynamicSchemaLayoutEdit id={id} schemaName={'pathologies'} panels={null} />;
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

export default PathologiesEdit;
