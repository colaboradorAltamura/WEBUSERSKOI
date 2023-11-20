// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types';

import DynamicSchemaLayoutEdit from 'src/views/components/dynamics/DynamicSchemaLayoutEdit';

const GoalTypesEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <DynamicSchemaLayoutEdit id={id} schemaName={'goalTypes'} panels={null} />;
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

export default GoalTypesEdit;
