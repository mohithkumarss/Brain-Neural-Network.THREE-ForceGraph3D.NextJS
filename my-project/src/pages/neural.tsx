"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import ForceGraph3D from "react-force-graph-3d";
import ReactDOM from "react-dom";

interface Node {
  id: number;
  val: number;
}

interface Link {
  source: number;
  target: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const initialData: GraphData = { nodes: [{ id: 0, val: 0 }], links: [] };

const N = 100; // Reduce the number of nodes
const nodes: Node[] = [...Array(N).keys()].map((i) => {
  return {
    id: i,
    val: Math.random() * 1.5 + 1,
  };
});

function generateLinks(nodes: Node[]): Link[] {
  let links: Link[] = [];
  nodes.forEach((node) => {
    let numNodeLinks = Math.round(Math.random() * (0.75 + Math.random())) + 1;
    for (let i = 0; i < numNodeLinks; i++) {
      links.push({
        source: node.id,
        target: Math.round(
          Math.random() * (node.id > 0 ? node.id - 1 : node.id)
        ),
      });
    }
  });
  return links;
}
const links: Link[] = generateLinks(nodes);
const gData: GraphData = { nodes, links };

const distance = 1500;

const NeuralB: React.FC = () => {
  const graphElemRef = useRef<HTMLDivElement>(null);
  let graphInstance: any = null; // Store the graph instance

  useEffect(() => {
    const graphElem = graphElemRef.current!;

    const group = new THREE.Group();
    const GraphComponent = (
      <ForceGraph3D
        graphData={gData}
        nodeThreeObject={(node: Node) => {
          const obj = new THREE.Mesh(
            new THREE.SphereGeometry(10),
            new THREE.MeshBasicMaterial({
              color: "white",
              transparent: true,
              opacity: 0.8,
            })
          );
          obj.userData = {
            ...node,
            origPos: {
              x: obj.position.x,
              y: obj.position.y,
              z: obj.position.z,
            },
          };
          group.add(obj);
          return obj;
        }}
        linkOpacity={0.5}
        linkCurvature={0.2}
        linkWidth={3}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={2}
        onEngineTick={() => {
          group.rotation.y += 0.01; // Continuous loop rotation
        }}
      />
    );

    ReactDOM.render(GraphComponent, graphElem);

    const createGraphInstance = () => {
      graphInstance = (
        <ForceGraph3D
          graphData={gData}
          nodeThreeObject={(node: Node) => {
            const obj = new THREE.Mesh(
              new THREE.SphereGeometry(5),
              new THREE.MeshBasicMaterial({
                color: "white",
                transparent: true,
                opacity: 0.8,
              })
            );
            obj.userData = {
              ...node,
              origPos: {
                x: obj.position.x,
                y: obj.position.y,
                z: obj.position.z,
              },
            };
            group.add(obj);
            return obj;
          }}
          linkOpacity={0.8}
          linkCurvature={0.2}
          linkWidth={1}
          linkDirectionalParticles={1}
          linkDirectionalParticleWidth={1}
          onEngineTick={() => {
            group.rotation.y += 0.01; // Continuous loop rotation
          }}
        />
      );
    };
  }, []);

  return <div ref={graphElemRef} id="3d-graph" />;
};

export default NeuralB;
