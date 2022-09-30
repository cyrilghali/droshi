import React, { useState,useEffect, DragEvent, useMemo, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  ReactFlowInstance,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  Controls,
  NodeOrigin,
} from 'reactflow';

import Sidebar from './Sidebar';

import styles from './dnd.module.css';
import CustomNode from '../Flow/CustomNode';

import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', data: { name: 'web', instance_type:'t2.micro', ami: 'ami-0dcc1e21636832c5d', }, position: { x: 100, y: 100 }, type: 'custom' },
];

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};


let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeOrigin: NodeOrigin = [0.5, 0.5];

function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const DnDFlow = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [nodeName, setNodeName] = useState<string>('web');
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));
  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);
  var hcl = 
`
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-west-2"
}

`;
  const onExport = (() => {
    nodes.forEach(nd => {
      const tempHcl =
`
resource "aws_instance" "${nd.data.name}" {
  ami           = "${nd.data.ami}"
  instance_type = "${nd.data.instance_type}"
}`
      hcl += tempHcl;
    });
    console.log(hcl);
    download("main.tf", hcl)
  });

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.selected === true) {
          // it's important that you create a new object here in order to notify react flow about the change
          n.data = {
            ...n.data,
            name: nodeName,
          };
        }

        return n;
      })
    );
  }, [nodeName]);



  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY - 40,
      });
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { name: `web`, instance_type: `t2.micro`, ami: `ami-0dcc1e21636832c5d`},
      };

      setNodes((nds) => nds.concat(newNode));
    }
  };


  return (
    <div className={styles.dndflow}>
      <ReactFlowProvider>
        <div className={styles.wrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeOrigin={nodeOrigin}
            fitView
            nodeTypes={nodeTypes}
          >
            <Controls />
            <div className={styles.controls}>
              <label>Name:</label>
              <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />
              <button onClick={onExport}>Export</button>
            </div>

          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
