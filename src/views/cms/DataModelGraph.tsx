// ** React Imports
import { useCallback, useEffect, useState } from 'react';
import Loader from 'src/@core/components/loader';
import { USERS_SCHEMA, handleError } from 'src/@core/coreHelper';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

import { useDynamics } from 'src/hooks/useDynamics';
import { EntitySchemaTypes, IEntitySchema, IEntitySchemaField } from 'src/types/entities';
import { IUser } from 'src/types/users';
import DynamicSchemaLayoutList from 'src/views/components/dynamics/DynamicSchemaLayoutList';

import ReactFlow, { addEdge, ConnectionLineType, useNodesState, useEdgesState } from 'reactflow';
import dagre from 'dagre';
import { v4 as uuidv4 } from 'uuid';

import 'reactflow/dist/style.css';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

type PropsType = {};

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

// TB / LR
const getLayoutedElements = (nodes: any, edges: any, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const DataModelGraph = ({}: PropsType) => {
  // ** Hooks
  const dynamics = useDynamics();
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const createGraph = (schemas: IEntitySchema[], allFields: IEntitySchemaField[]) => {
    const entities: { id: string; name: string }[] = schemas.map((schema) => {
      return { id: schema.id, name: schema.name };
    });
    const relationships: any = [];

    // const meNode = { id: currentUserContext.currentEntity?.id, name: currentUserContext.currentEntity?.name };

    schemas.forEach((schema: IEntitySchema) => {
      if (
        schema.schemaType === EntitySchemaTypes.RELATIONSHIP_ENTITY ||
        schema.schemaType === EntitySchemaTypes.RELATIONSHIP_USER2USER_ENTITY
      ) {
        relationships.push({
          id: uuidv4(),
          source: schema.relationshipSourceSchemaId,
          target: schema.id,
          type: edgeType,
          animated: true,
        });

        relationships.push({
          id: uuidv4(),
          source: schema.id,
          target: schema.relationshipTargetSchemaId,
          type: edgeType,
          animated: true,
        });
      } else if (schema.schemaType === EntitySchemaTypes.ONE_TO_MANY_ENTITY) {
        relationships.push({
          id: uuidv4(),
          source: schema.relationshipSourceSchemaId,
          target: schema.id,
          type: edgeType,
          animated: true,
        });
      } else if (schema.schemaType === EntitySchemaTypes.USER_ENTITY) {
        relationships.push({
          id: uuidv4(),
          source: USERS_SCHEMA.id,
          target: schema.id,
          type: edgeType,
          animated: true,
        });
      }

      // if (!acquirer) acquirer = meNode;
    });

    allFields.forEach((field) => {
      if (!field.relationshipSchemaId) return;

      relationships.push({
        id: uuidv4(),
        source: field.relationshipSchemaId,
        target: field.schemaId,
        type: edgeType,
        animated: true,
      });
    });

    const { nodes, edges } = getLayoutedElements(
      entities.map((ent: any) => {
        return {
          id: ent.id,

          // type: 'input',
          data: { label: ent.name },
          position,
        };
      }),
      relationships
    );

    setNodes(nodes);

    setEdges(edges);
  };

  useEffect(() => {
    const doAsync = async () => {
      try {
        setIsLoading(true);
        if (dynamics.isLoadingSchemas || !dynamics.entitySchemas || !dynamics.entitySchemasFields) return;

        setNodes([]);
        setEdges([]);

        createGraph(dynamics.entitySchemas, dynamics.entitySchemasFields);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        handleError(e);
      }
    };

    doAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamics.isLoadingSchemas]);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isLoading) return <Loader />;

  return (
    <>
      {!!nodes && !!nodes.length && (
        <Grid item xs={12} style={{ height: 300 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          >
            {/* <Panel position='top-right'>
          <button onClick={() => onLayout('TB')}>vertical layout</button>
          <button onClick={() => onLayout('LR')}>horizontal layout</button>
        </Panel> */}
          </ReactFlow>
        </Grid>
      )}
    </>
  );
};

export default DataModelGraph;
