// ** MUI Import
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline';
import MuiCardHeader, { CardHeaderProps } from '@mui/material/CardHeader';

// ** Custom Components Imports

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none',
    },
  },
});

const CardHeader = styled(MuiCardHeader)<CardHeaderProps>(({ theme }) => ({
  '& .MuiTypography-root': {
    lineHeight: 1.6,
    fontWeight: 500,
    fontSize: '1.125rem',
    letterSpacing: '0.15px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },
}));

// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import { useTranslation } from 'react-i18next';

// ** Custom Components Imports
import { Box, Button, Divider, IconButton, Tooltip, Typography, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import { getSourceEntityData, handleError, hasRole, nameof } from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useDynamics } from 'src/hooks/useDynamics';
import { dynamicCreate, dynamicGet, dynamicUpdate } from 'src/services/entitiesDynamicServices';
import { CMSCollections, IUserBasicData, IUserInteraction } from 'src/types/@autogenerated';
import { IForm } from 'src/types/dynamics';
import { IEntitySchema, IEntitySchemaField, IEntitySchemaWithFields } from 'src/types/entities';
import { schemaToForm, updateEntityDataBySchema } from '../components/dynamics/helpers';
import DynamicFormSidebar from '../components/dynamics/DynamicFormSidebar';
import { IWorker } from 'src/types/@autogenerated';

interface PropsType {
  docId: string;
  schemaArg: IEntitySchema;
  dataArg: IWorker;
  schemaFieldsArg: IEntitySchemaField[];
}

interface IInteractionRow {
  userInteraction: IUserInteraction;
  userData: IUserBasicData;
}

const SCHEMA_NAME = CMSCollections.USER_INTERACTIONS;
// workerDataArg: IUser;
const UserInteractions = ({ docId, schemaArg, dataArg, schemaFieldsArg }: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  // ** State
  const [entitySchema, setEntitySchema] = useState<IEntitySchema>();
  const [entitySchemaFields, setEntitySchemaFields] = useState<IEntitySchemaField[]>();
  const [entityDataWorker, setEntityDataWorker] = useState<IWorker>(dataArg);
  const [editInteractionForm, setEditInteractionForm] = useState<IForm | null>(null);
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [toggleData, setToggleData] = useState<boolean>(false);
  const [interactionsData, setInteractionsData] = useState<IUserInteraction[]>([]);
  const [attendantsData, setAttendantsData] = useState<IUserBasicData[]>([]);
  const [interactionRowData, setInteractionRowData] = useState<IInteractionRow[]>([]);

  //- SideBarOpen
  const [editInteractionSidebarOpen, setEditInteractionSidebarOpen] = useState<boolean>(false);
  const toggleEditInteractionDrawer = () => setEditInteractionSidebarOpen(!editInteractionSidebarOpen);

  //- InteractionColorSelector

  const timeLineColor = (interactionType: string) => {
    switch (interactionType) {
      case 'appointment-scheduling':
        return 'warning';
      case 'survey-and-feedback-collection':
        return 'info';
      case 'outbound-request':
        return 'success';
      case 'inbound-request':
        return 'error';
      case 'system':
        return 'primary';
      case 'support':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  //**InteractionEditFuncs */
  const handleNewInteraction = () => {
    // debugger;
    try {
      if (!entitySchema) throw new Error('missing entitySchema');
      if (!entitySchemaFields) throw new Error('missing entitySchemaFields');
      if (!entityDataWorker) throw new Error('missing entityDataWorker');

      //check if there is any interaction field missing
      const interactionFieldNames = [
        nameof<IUserInteraction>('userId'),
        nameof<IUserInteraction>('interactionDate'),
        nameof<IUserInteraction>('interactionType'),
        nameof<IUserInteraction>('channel'),
        nameof<IUserInteraction>('notes'),
        nameof<IUserInteraction>('attendantUserId'),
      ];
      // 'channelhjjhhj', 'interactionDate', 'notes', 'interactionType', 'userId'];
      //render only interaction fields
      const interactionFields = entitySchemaFields.filter((field) => {
        return interactionFieldNames.includes(field.name);
      });

      //create form
      const interactionForm = schemaToForm(entitySchema, interactionFields, null, dynamics);

      setEditInteractionForm(interactionForm);
      toggleEditInteractionDrawer();
    } catch (e: any) {
      handleError(e);
    }
  };

  const handleSubmitNewInteraction = async (formData: any) => {
    try {
      setLoadingData(true);

      //create new interaction entity
      await createInteractionEntity(formData);

      setToggleData(!toggleData);
      setLoadingData(false);
    } catch (e: any) {
      setLoadingData(false);
      handleError(e);
    }
  };

  //create new interaction entity
  const createInteractionEntity = async (formData: IUserInteraction) => {
    let response = null;
    formData.userId = docId;

    response = await dynamicCreate({
      params: `/cms/${SCHEMA_NAME}`,
      data: formData,
    });
  };

  //update interaction entity
  const updateInteractionEntity = async (formData: any) => {
    let response = null;

    response = await dynamicUpdate({
      params: `/cms/${SCHEMA_NAME}/` + formData.id,
      data: formData,
    });
  };

  const listInteractionsByUser = async (userId: string) => {
    let response = null;

    response = await dynamicGet({
      params: `/cms/${SCHEMA_NAME}/by-user/` + userId,
    });

    return response;
  };

  // fetch schema
  useEffect(() => {
    const doAsync = async () => {
      try {
        setLoadingSchema(true);

        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return null;

        const schema = dynamics.entitySchemas.find((schema) => {
          return schema.name === SCHEMA_NAME;
        });
        if (!schema) throw new Error('Missing schemaName: ' + SCHEMA_NAME);
        const schemaFields = dynamics.entitySchemasFields.filter((field) => {
          return field.schemaId === schema.id;
        });

        // Fetch Schema
        const entitySchemaResponse: IEntitySchemaWithFields = { ...schema, fields: schemaFields };

        setEntitySchema(entitySchemaResponse);

        // Fetch Fields

        // Fetch Interactions
        const interactionsResponse = await listInteractionsByUser(docId);
        console.log('interactionsListbyUser', interactionsResponse);
        setInteractionsData(interactionsResponse.items);

        // Fetch interaction attendant data
        const interactionListByAttendant = interactionsResponse.items;
        setInteractionRowData(
          interactionListByAttendant.map((interaction: IUserInteraction) => {
            const attendant = getSourceEntityData({
              obj: interaction,
              key: nameof<IUserInteraction>('attendantUserId'),
            });

            return {
              userInteraction: interaction,
              userData: attendant,
            };
          })
        );

        setEntitySchemaFields(
          entitySchemaResponse.fields.sort((a, b) => {
            return a.order - b.order;
          })
        );

        setLoadingSchema(false);
      } catch (e: any) {
        handleError(e);
        setLoadingSchema(false);
      }
    };

    doAsync();
  }, [dynamics.isLoadingSchemas, interactionsData.length, toggleData]);

  return (
    <Grid>
      {!!editInteractionSidebarOpen && (
        <DynamicFormSidebar
          isCreating={false}
          onSubmit={handleSubmitNewInteraction}
          title={'New ' + entityDataWorker?.firstName + ' interaction'}
          formId={'Edit_' + entityDataWorker?.userId}
          // initialValues={entityDataWorker}
          preloadForm={editInteractionForm}
          open={editInteractionSidebarOpen}
          toggle={toggleEditInteractionDrawer}
          onSubmitDone={() => {
            toggleEditInteractionDrawer();

            return Promise.resolve();
          }}
        />
      )}
      <Card>
        <CardHeader
          title={capitalize(t('interactions'))}
          action={
            <Button
              variant='contained'
              onClick={() => {
                handleNewInteraction();
              }}
              sx={{ mr: 4, mb: [2, 0] }}
            >
              {capitalize(t('new'))}
            </Button>
          }
        />
        <CardContent>
          <Timeline>
            {interactionRowData?.map((item) => {
              return (
                <TimelineItem key={item.userInteraction.id}>
                  <TimelineSeparator>
                    <TimelineDot color={timeLineColor(item.userInteraction.interactionType)} sx={{ mt: 1.5 }} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ pt: 0, mt: 0, mb: (theme) => `${theme.spacing(2)} !important` }}>
                    <Box
                      sx={{
                        mb: 0.5,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant='h6' sx={{ mr: 2 }}>
                        {item.userInteraction.interactionType}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {item.userInteraction.interactionDate.toString()}
                      </Typography>
                    </Box>
                    <Typography variant='body2' sx={{ mb: 2.5 }}>
                      {item.userInteraction.notes}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.userData && <Avatar src={item.userData.avatarUrl} sx={{ mr: 3, width: 38, height: 38 }} />}
                      {item.userData && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                            {item.userData.firstName + ' ' + item.userData.lastName}
                          </Typography>
                          <Typography variant='caption'>Interaction Ending</Typography>
                        </Box>
                      )}
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserInteractions;
