// ** MUI Import

// ** Demo Component Imports

// ** Custom Component Imports

import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
// import { renderToString } from 'react-dom/server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Editor = require('blocks-ui');

const DynamicPageContent = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const [components, setComponents] = useState<any[] | null>(null);
  const [preRenderedComponent, setPreRenderedComponent] = useState<string | null>(null);

  const getData = async (component: any) => {
    const ReactDOMServer = (await import('react-dom/server')).default;
    const staticMarkup = ReactDOMServer.renderToStaticMarkup(component);

    return staticMarkup;
  };

  useEffect(() => {
    const components: any[] = [{}];

    setComponents(components);

    const doAsync = async () => {
      const comp = (
        <Button
          onClick={() => {
            alert(1);
          }}
          variant='contained'
          sx={{ '& svg': { mr: 2 } }}
        >
          {/* <Icon fontSize='1.125rem' icon='tabler:plus' /> */}
          New
        </Button>
      );
      const data = await getData(comp);

      setPreRenderedComponent(data);
    };

    doAsync();
  }, []);

  return (
    <>
      {pathName}
      <Button
        onClick={() => {
          alert(1);
        }}
        variant='contained'
        sx={{ '& svg': { mr: 2 } }}
      >
        {/* <Icon fontSize='1.125rem' icon='tabler:plus' /> */}
        New
      </Button>

      {preRenderedComponent && <div dangerouslySetInnerHTML={{ __html: preRenderedComponent }}></div>}
    </>
  );
};

const Router = ({}) => {
  // ** Hooks

  const JSX = `asdasdasdadsadsads gds fddfs`;

  const routes = useRoutes([
    {
      path: '/a/example',
      element: <DynamicPageContent />,
    },
  ]);

  return routes;
};

const UIBuilderPageContent = () => {
  const [closedApplicants, setClosedApplicants] = useState<any[]>([]);
  const [openApplicants, setOpenApplicants] = useState<any[]>([]);
  const [compError, setCompError] = useState<any[] | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const doAsync = async () => {
      try {
      } catch (e: any) {
        setCompError(e);
      }
    };

    doAsync();
  }, []);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default UIBuilderPageContent;
