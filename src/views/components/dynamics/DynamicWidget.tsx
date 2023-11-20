// formik components

import { useEffect, useState } from 'react';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import { useDynamics } from 'src/hooks/useDynamics';
import { dynamicGet } from 'src/services/entitiesDynamicServices';
import { IDynamicInlineComponent, IForm, IWidget } from 'src/types/dynamics';
import { invokeEvent } from './helpers';
import DynamicComponent from './DynamicComponent';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

interface PropsType {
  widgetId: string;

  initialValues?: any;
  onWidgetFetched?: (form: any) => Promise<any>;

  inlineComponents?: IDynamicInlineComponent[];
}

const DynamicWidget = ({
  widgetId,

  onWidgetFetched,
  inlineComponents,
}: PropsType) => {
  // ** State
  const [widget, setWidget] = useState<IWidget>();

  const [currentInitialValues, setCurrentInitialValues] = useState<any>(null);
  const [readyState, setReadyState] = useState<boolean>(false);

  // ** Hooks
  const dynamics = useDynamics();

  // ** Effects
  useEffect(() => {
    const doAsync = async () => {
      try {
        const response = await dynamicGet({ params: '/appCreator/widgets/' + widgetId });

        if (onWidgetFetched) onWidgetFetched(response);

        setWidget(response);
      } catch (e: any) {
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId]);

  useEffect(() => {
    const doAsync = async () => {
      try {
        if (!widget) return;

        if (!widget.preloadEvents) {
          setReadyState(true);

          return;
        }

        setReadyState(false);

        const promises: Promise<any>[] = [];

        widget.preloadEvents.forEach((preloadEvent) => {
          // const dynamicEvent = dynamics.events.find((event) => {
          //   return event.name === preloadEvent.name;
          // });

          // if (dynamicEvent) {
          promises.push(
            new Promise((resolve, reject) => {
              invokeEvent(
                dynamics,
                widget.preDefinedEvents,
                preloadEvent.name,
                {}, // itemValues

                false // isCreating
              )
                .then((result) => {
                  // seteo variables de este componente
                  if (preloadEvent.destinationContextVariableName)
                    dynamics.addVariable({
                      name: preloadEvent.destinationContextVariableName,
                      value: result,
                    });

                  resolve(result);
                })
                .catch((e) => {
                  reject(e);
                });
            })
          );

          // }
        });

        const results = await Promise.all(promises);

        setReadyState(true);
      } catch (e: any) {
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget, dynamics.refreshVariablesFlags]);

  if (!widget || !readyState) return <Loader />;

  return (
    <>
      <Card>
        <CardHeader title={widget.title} />
        {widget.components.map((component, index) => {
          return (
            <Grid container key={index}>
              <Grid item xs={12}>
                <DynamicComponent component={component} containerTitle={widget.title} />
              </Grid>
            </Grid>
          );
        })}
      </Card>
    </>
  );
};

export default DynamicWidget;
