import { CollisionMap } from '../collision/CollisionMap';

interface Node {
  x: number;
  y: number;
  f: number; // Total cost (g + h)
  g: number; // Cost from start
  h: number; // Heuristic (estimated cost to goal)
  parent: Node | null;
}

export class PathFinder {
  constructor(private collisionMap: CollisionMap) {}

  findPath(startX: number, startY: number, endX: number, endY: number): { x: number; y: number }[] {
    // Convert world coordinates to grid coordinates
    const gridStart = {
      x: Math.floor(startX / this.collisionMap.getGridSize()),
      y: Math.floor(startY / this.collisionMap.getGridSize()),
    };
    const gridEnd = {
      x: Math.floor(endX / this.collisionMap.getGridSize()),
      y: Math.floor(endY / this.collisionMap.getGridSize()),
    };

    const openSet: Node[] = [];
    const closedSet: Set<string> = new Set();

    // Add start node
    const startNode: Node = {
      x: gridStart.x,
      y: gridStart.y,
      f: 0,
      g: 0,
      h: this.heuristic(gridStart.x, gridStart.y, gridEnd.x, gridEnd.y),
      parent: null,
    };
    openSet.push(startNode);

    while (openSet.length > 0) {
      // Get node with lowest f score
      const currentNode = this.getLowestFScore(openSet);

      // Check if we reached the end
      if (currentNode.x === gridEnd.x && currentNode.y === gridEnd.y) {
        return this.reconstructPath(currentNode);
      }

      // Move current node from open to closed set
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.add(`${currentNode.x},${currentNode.y}`);

      // Check neighbors
      const neighbors = this.getNeighbors(currentNode);
      for (const neighbor of neighbors) {
        if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

        const tentativeG = currentNode.g + 1;

        const existingNeighbor = openSet.find(
          node => node.x === neighbor.x && node.y === neighbor.y
        );

        if (!existingNeighbor) {
          neighbor.g = tentativeG;
          neighbor.h = this.heuristic(neighbor.x, neighbor.y, gridEnd.x, gridEnd.y);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = currentNode;
          openSet.push(neighbor);
        } else if (tentativeG < existingNeighbor.g) {
          existingNeighbor.g = tentativeG;
          existingNeighbor.f = existingNeighbor.g + existingNeighbor.h;
          existingNeighbor.parent = currentNode;
        }
      }
    }

    return []; // No path found
  }

  private heuristic(x1: number, y1: number, x2: number, y2: number): number {
    // Manhattan distance
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }

  private getLowestFScore(nodes: Node[]): Node {
    return nodes.reduce((lowest, node) => (node.f < lowest.f ? node : lowest), nodes[0]);
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 1, y: 0 }, // Right
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
    ];

    for (const dir of directions) {
      const x = node.x + dir.x;
      const y = node.y + dir.y;

      // Check if position is walkable
      if (
        !this.collisionMap.isBlocked(
          x * this.collisionMap.getGridSize(),
          y * this.collisionMap.getGridSize()
        )
      ) {
        neighbors.push({
          x,
          y,
          f: 0,
          g: 0,
          h: 0,
          parent: null,
        });
      }
    }

    return neighbors;
  }

  private reconstructPath(endNode: Node): { x: number; y: number }[] {
    const path: { x: number; y: number }[] = [];
    let current: Node | null = endNode;

    while (current) {
      path.unshift({
        x: current.x * this.collisionMap.getGridSize(),
        y: current.y * this.collisionMap.getGridSize(),
      });
      current = current.parent;
    }

    return path;
  }
}
