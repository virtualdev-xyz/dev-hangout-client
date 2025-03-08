import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { DrawingPath, DrawingPoint, Layer, Shape, ShapeType, DiagramTemplate, Connection } from '../../network/socket/types';
import { DiagramTemplates } from './DiagramTemplates';

interface WhiteboardProps {
  roomId: string;
  userId: string;
  readOnly?: boolean;
}

interface SelectedShape {
  shape: Shape;
  initialX: number;
  initialY: number;
  offsetX: number;
  offsetY: number;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({
  roomId,
  userId,
  readOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'default', name: 'Layer 1', visible: true, locked: false, order: 0 },
  ]);
  const [selectedLayer, setSelectedLayer] = useState<string>('default');
  const [tool, setTool] = useState<'pen' | 'eraser' | 'shape' | 'select'>('pen');
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [color, setColor] = useState('#4EC9B0');
  const [fill, setFill] = useState<string | undefined>(undefined);
  const [width, setWidth] = useState(2);
  const [selectedShape, setSelectedShape] = useState<SelectedShape | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [templates, setTemplates] = useState<DiagramTemplate[]>([]);
  const [isDraggingTemplate, setIsDraggingTemplate] = useState(false);
  const { emit, on, off } = useSocket();

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    // Get context
    const context = canvas.getContext('2d');
    if (!context) return;

    // Configure context
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = width;

    contextRef.current = context;

    // Request initial state
    emit('whiteboard:join', roomId);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !contextRef.current) return;

      // Save current drawing
      const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);

      // Resize canvas
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;

      // Restore context settings
      contextRef.current.scale(window.devicePixelRatio, window.devicePixelRatio);
      contextRef.current.lineCap = 'round';
      contextRef.current.lineJoin = 'round';

      // Restore drawing
      contextRef.current.putImageData(imageData, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle remote drawing events
  useEffect(() => {
    const handleRemotePath = (path: DrawingPath) => {
      if (path.userId !== userId) {
        setPaths(prevPaths => [...prevPaths, path]);
        drawPath(path);
      }
    };

    const handleSync = (data: { paths: DrawingPath[]; layers: Layer[] }) => {
      console.log('Received whiteboard sync:', data);
      setPaths(data.paths);
      setLayers(data.layers);
      redrawCanvas();
    };

    const handleLayerAdd = (layer: Layer) => {
      console.log('Received layer add:', layer);
      setLayers(prevLayers => [...prevLayers, layer]);
    };

    const handleLayerUpdate = (layer: Layer) => {
      setLayers(prevLayers =>
        prevLayers.map(l => (l.id === layer.id ? layer : l))
      );
      redrawCanvas();
    };

    const handleLayerDelete = (layerId: string) => {
      setLayers(prevLayers => prevLayers.filter(l => l.id !== layerId));
      setPaths(prevPaths => prevPaths.filter(p => p.layerId !== layerId));
      redrawCanvas();
    };

    const handleShapeUpdate = (shape: Shape) => {
      setPaths(prevPaths =>
        prevPaths.map(p =>
          p.shape?.id === shape.id ? { ...p, shape } : p
        )
      );
      redrawCanvas();
    };

    const handleShapeDelete = (shapeId: string) => {
      setPaths(prevPaths =>
        prevPaths.filter(p => p.shape?.id !== shapeId)
      );
      redrawCanvas();
    };

    const handleTemplateAdd = (template: DiagramTemplate) => {
      setTemplates(prevTemplates => [...prevTemplates, template]);
    };

    const handleTemplateApply = (data: { shapes: Shape[]; connections: Connection[] }) => {
      setPaths(prevPaths => [
        ...prevPaths,
        ...data.shapes.map(shape => ({
          id: `${userId}-${Date.now()}-${shape.id}`,
          userId,
          color: shape.color,
          points: [] as DrawingPoint[],
          tool: 'shape' as const,
          width: shape.strokeWidth,
          layerId: shape.layerId,
          shape,
        })),
      ]);
      setConnections(prevConnections => [...prevConnections, ...data.connections]);
      redrawCanvas();
    };

    on('whiteboard:path', handleRemotePath);
    on('whiteboard:sync', handleSync);
    on('whiteboard:layer:add', handleLayerAdd);
    on('whiteboard:layer:update', handleLayerUpdate);
    on('whiteboard:layer:delete', handleLayerDelete);
    on('whiteboard:shape:update', handleShapeUpdate);
    on('whiteboard:shape:delete', handleShapeDelete);
    on('whiteboard:template:add', handleTemplateAdd);
    on('whiteboard:template:apply', handleTemplateApply);

    return () => {
      off('whiteboard:path', handleRemotePath);
      off('whiteboard:sync', handleSync);
      off('whiteboard:layer:add', handleLayerAdd);
      off('whiteboard:layer:update', handleLayerUpdate);
      off('whiteboard:layer:delete', handleLayerDelete);
      off('whiteboard:shape:update', handleShapeUpdate);
      off('whiteboard:shape:delete', handleShapeDelete);
      off('whiteboard:template:add', handleTemplateAdd);
      off('whiteboard:template:apply', handleTemplateApply);
    };
  }, [userId]);

  const getPointerPosition = (event: React.PointerEvent<HTMLCanvasElement>): DrawingPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
      pressure: event.pressure,
    };
  };

  const startDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    event.preventDefault();
    const point = getPointerPosition(event);

    if (tool === 'select') {
      const clickedShape = findShapeAtPoint(point.x, point.y);
      if (clickedShape) {
        setSelectedShape({
          shape: clickedShape,
          initialX: clickedShape.x,
          initialY: clickedShape.y,
          offsetX: point.x - clickedShape.x,
          offsetY: point.y - clickedShape.y,
        });
      }
      return;
    }

    setIsDrawing(true);
    const newPath: DrawingPath = {
      id: `${userId}-${Date.now()}`,
      userId,
      color: tool === 'eraser' ? '#1E1E1E' : color,
      points: [point],
      tool: tool === 'shape' ? 'shape' : tool,
      width: tool === 'eraser' ? width * 2 : width,
      layerId: selectedLayer,
      ...(tool === 'shape' && {
        shape: {
          id: `${userId}-${Date.now()}-shape`,
          type: shapeType,
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
          color,
          strokeWidth: width,
          fill,
          layerId: selectedLayer,
        },
      }),
    };
    setCurrentPath(newPath);

    if (tool !== 'shape') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(point.x, point.y);
    }
  }, [userId, color, tool, width, selectedLayer, shapeType, fill, readOnly]);

  const draw = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath || !contextRef.current) return;

    event.preventDefault();
    const point = getPointerPosition(event);

    if (tool === 'select' && selectedShape) {
      const newX = point.x - selectedShape.offsetX;
      const newY = point.y - selectedShape.offsetY;
      setSelectedShape(prev => prev ? {
        ...prev,
        shape: { ...prev.shape, x: newX, y: newY },
      } : null);
      redrawCanvas();
      return;
    }

    if (tool === 'shape' && currentPath.shape) {
      const shape = currentPath.shape;
      shape.width = point.x - shape.x;
      shape.height = point.y - shape.y;
      redrawCanvas();
      return;
    }

    // Add point to current path
    const newPoints = [...currentPath.points, point];
    const updatedPath = { ...currentPath, points: newPoints };
    setCurrentPath(updatedPath);

    // Draw line
    contextRef.current.strokeStyle = updatedPath.color;
    contextRef.current.lineWidth = updatedPath.width * (point.pressure || 1);
    contextRef.current.lineTo(point.x, point.y);
    contextRef.current.stroke();
  }, [isDrawing, currentPath, tool, selectedShape]);

  const endDrawing = useCallback(() => {
    if (!isDrawing && !selectedShape) return;
    if (!currentPath && !selectedShape) return;
    if (!contextRef.current) return;

    if (tool === 'select' && selectedShape) {
      const { shape, initialX, initialY } = selectedShape;
      if (shape.x !== initialX || shape.y !== initialY) {
        emit('whiteboard:shape:update', {
          roomId,
          shape,
        });
      }
      setSelectedShape(null);
      return;
    }

    if (currentPath) {
      contextRef.current.closePath();
      setIsDrawing(false);

      // Add path to paths array
      setPaths(prevPaths => [...prevPaths, currentPath]);

      // Send path to server
      emit('whiteboard:path', {
        roomId,
        path: currentPath,
      });

      setCurrentPath(null);
    }
  }, [isDrawing, currentPath, tool, selectedShape, roomId]);

  const drawPath = useCallback((path: DrawingPath) => {
    if (!contextRef.current) return;

    const layer = layers.find(l => l.id === path.layerId);
    if (!layer?.visible) return;

    if (path.shape) {
      drawShape(path.shape);
      return;
    }

    contextRef.current.beginPath();
    contextRef.current.strokeStyle = path.color;
    contextRef.current.lineWidth = path.width;

    path.points.forEach((point, index) => {
      if (index === 0) {
        contextRef.current!.moveTo(point.x, point.y);
      } else {
        contextRef.current!.lineTo(point.x, point.y);
        if (point.pressure) {
          contextRef.current!.lineWidth = path.width * point.pressure;
        }
      }
    });

    contextRef.current.stroke();
    contextRef.current.closePath();
  }, [layers]);

  const drawShape = useCallback((shape: Shape) => {
    if (!contextRef.current) return;

    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;

    switch (shape.type) {
      case 'rectangle':
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case 'circle':
        const radius = Math.sqrt(shape.width * shape.width + shape.height * shape.height) / 2;
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'diamond':
        ctx.moveTo(shape.x + shape.width / 2, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y + shape.height / 2);
        ctx.lineTo(shape.x + shape.width / 2, shape.y + shape.height);
        ctx.lineTo(shape.x, shape.y + shape.height / 2);
        ctx.closePath();
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'database':
        const ellipseHeight = shape.height * 0.2;
        // Top ellipse
        ctx.beginPath();
        ctx.ellipse(
          shape.x + shape.width / 2,
          shape.y + ellipseHeight / 2,
          shape.width / 2,
          ellipseHeight / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        // Side lines
        ctx.moveTo(shape.x, shape.y + ellipseHeight / 2);
        ctx.lineTo(shape.x, shape.y + shape.height - ellipseHeight / 2);
        ctx.moveTo(shape.x + shape.width, shape.y + ellipseHeight / 2);
        ctx.lineTo(shape.x + shape.width, shape.y + shape.height - ellipseHeight / 2);
        // Bottom ellipse
        ctx.beginPath();
        ctx.ellipse(
          shape.x + shape.width / 2,
          shape.y + shape.height - ellipseHeight / 2,
          shape.width / 2,
          ellipseHeight / 2,
          0,
          0,
          Math.PI * 2
        );
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'server':
        // Main rectangle
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        // Server lines
        const lineGap = shape.height / 8;
        for (let i = 1; i <= 3; i++) {
          ctx.moveTo(shape.x + 10, shape.y + i * lineGap);
          ctx.lineTo(shape.x + shape.width - 10, shape.y + i * lineGap);
        }
        ctx.stroke();
        break;

      case 'cloud':
        ctx.beginPath();
        const circles = [
          { x: shape.x + shape.width * 0.4, y: shape.y + shape.height * 0.3, r: shape.width * 0.2 },
          { x: shape.x + shape.width * 0.6, y: shape.y + shape.height * 0.3, r: shape.width * 0.2 },
          { x: shape.x + shape.width * 0.3, y: shape.y + shape.height * 0.5, r: shape.width * 0.2 },
          { x: shape.x + shape.width * 0.7, y: shape.y + shape.height * 0.5, r: shape.width * 0.2 },
          { x: shape.x + shape.width * 0.5, y: shape.y + shape.height * 0.6, r: shape.width * 0.2 },
        ];
        circles.forEach(circle => {
          ctx.moveTo(circle.x + circle.r, circle.y);
          ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        });
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'line':
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
        ctx.stroke();
        break;

      case 'arrow':
        const angle = Math.atan2(shape.height, shape.width);
        const length = Math.sqrt(shape.width * shape.width + shape.height * shape.height);
        const arrowSize = Math.min(20, length * 0.3);

        // Draw main line
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y + shape.height);

        // Draw arrowhead
        ctx.moveTo(shape.x + shape.width, shape.y + shape.height);
        ctx.lineTo(
          shape.x + shape.width - arrowSize * Math.cos(angle - Math.PI / 6),
          shape.y + shape.height - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(shape.x + shape.width, shape.y + shape.height);
        ctx.lineTo(
          shape.x + shape.width - arrowSize * Math.cos(angle + Math.PI / 6),
          shape.y + shape.height - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
    }

    // Draw text if present
    if (shape.text) {
      ctx.save();
      ctx.font = `${shape.fontSize || 14}px ${shape.fontFamily || 'Source Code Pro'}`;
      ctx.fillStyle = shape.color;
      ctx.textAlign = shape.textAlign || 'center';
      ctx.textBaseline = shape.textBaseline || 'middle';

      const lines = shape.text.split('\n');
      const lineHeight = (shape.fontSize || 14) * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = shape.y + shape.height / 2 - totalHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(
          line,
          shape.x + shape.width / 2,
          startY + index * lineHeight + lineHeight / 2
        );
      });
      ctx.restore();
    }
  }, []);

  const drawConnection = useCallback((connection: Connection) => {
    if (!contextRef.current) return;

    const fromShape = paths.find(p => p.shape?.id === connection.fromShapeId)?.shape;
    const toShape = paths.find(p => p.shape?.id === connection.toShapeId)?.shape;
    if (!fromShape || !toShape) return;

    const ctx = contextRef.current;
    ctx.save();
    ctx.strokeStyle = connection.color;
    ctx.lineWidth = connection.width;

    // Set line style
    switch (connection.type) {
      case 'dashed':
        ctx.setLineDash([10, 5]);
        break;
      case 'dotted':
        ctx.setLineDash([2, 2]);
        break;
      default:
        ctx.setLineDash([]);
    }

    // Calculate connection points
    const fromX = fromShape.x + fromShape.width / 2;
    const fromY = fromShape.y + fromShape.height / 2;
    const toX = toShape.x + toShape.width / 2;
    const toY = toShape.y + toShape.height / 2;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrows
    if (connection.arrowStart || connection.arrowEnd) {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const arrowSize = 10;

      if (connection.arrowEnd) {
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowSize * Math.cos(angle - Math.PI / 6),
          toY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowSize * Math.cos(angle + Math.PI / 6),
          toY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }

      if (connection.arrowStart) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(
          fromX + arrowSize * Math.cos(angle - Math.PI / 6),
          fromY + arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(
          fromX + arrowSize * Math.cos(angle + Math.PI / 6),
          fromY + arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    }

    // Draw label
    if (connection.label) {
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      ctx.save();
      ctx.font = '12px "Source Code Pro"';
      ctx.fillStyle = connection.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(connection.label, midX, midY - 10);
      ctx.restore();
    }

    ctx.restore();
  }, [paths]);

  const redrawCanvas = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;

    // Clear canvas
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Sort paths by layer order
    const sortedPaths = [...paths].sort((a, b) => {
      const layerA = layers.find(l => l.id === a.layerId);
      const layerB = layers.find(l => l.id === b.layerId);
      return (layerA?.order || 0) - (layerB?.order || 0);
    });

    // Redraw all paths
    sortedPaths.forEach(drawPath);

    // Draw connections
    connections.forEach(drawConnection);

    // Draw current path if exists
    if (currentPath) {
      drawPath(currentPath);
    }

    // Draw selection outline
    if (selectedShape) {
      const { shape } = selectedShape;
      contextRef.current.setLineDash([5, 5]);
      contextRef.current.strokeStyle = '#00FF00';
      contextRef.current.lineWidth = 1;
      contextRef.current.strokeRect(
        shape.x - 5,
        shape.y - 5,
        shape.width + 10,
        shape.height + 10
      );
      contextRef.current.setLineDash([]);
    }
  }, [paths, currentPath, selectedShape, layers, connections, drawPath, drawConnection]);

  const findShapeAtPoint = useCallback((x: number, y: number): Shape | null => {
    // Search in reverse order to find top-most shape
    for (let i = paths.length - 1; i >= 0; i--) {
      const path = paths[i];
      if (!path.shape) continue;

      const shape = path.shape;
      const layer = layers.find(l => l.id === shape.layerId);
      if (!layer?.visible || layer.locked) continue;

      // Check if point is inside shape bounds
      if (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      ) {
        return shape;
      }
    }
    return null;
  }, [paths, layers]);

  const addLayer = useCallback(() => {
    console.log('Adding new layer, current layers:', layers);
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      order: layers.length,
    };

    console.log('Emitting new layer:', newLayer);
    emit('whiteboard:layer:add', {
      roomId,
      layer: newLayer,
    });
  }, [layers.length, roomId]);

  const updateLayer = useCallback((layer: Layer) => {
    emit('whiteboard:layer:update', {
      roomId,
      layer,
    });
  }, [roomId]);

  const deleteLayer = useCallback((layerId: string) => {
    if (layers.length <= 1) return; // Don't delete last layer
    emit('whiteboard:layer:delete', {
      roomId,
      layerId,
    });
  }, [layers.length, roomId]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingTemplate(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingTemplate(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingTemplate(false);

    const templateData = event.dataTransfer.getData('template');
    if (!templateData) return;

    const template: DiagramTemplate = JSON.parse(templateData);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) * (canvasRef.current!.width / rect.width);
    const y = (event.clientY - rect.top) * (canvasRef.current!.height / rect.height);

    // Offset all shapes relative to drop position
    const offsetShapes = template.shapes.map(shape => ({
      ...shape,
      x: shape.x + x,
      y: shape.y + y,
      id: `${shape.id}-${Date.now()}`,
    }));

    // Update connection references
    const offsetConnections = template.connections.map(conn => ({
      ...conn,
      id: `${conn.id}-${Date.now()}`,
      fromShapeId: `${conn.fromShapeId}-${Date.now()}`,
      toShapeId: `${conn.toShapeId}-${Date.now()}`,
    }));

    emit('whiteboard:template:apply', {
      roomId,
      templateId: template.id,
      position: { x, y },
    });
  }, [roomId]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: '#1E1E1E',
    }}>
      <div style={{
        padding: '8px',
        borderBottom: '1px solid #333',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value as typeof tool)}
          style={{
            backgroundColor: '#2A2A2A',
            color: '#D4D4D4',
            border: '1px solid #333',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
          <option value="shape">Shape</option>
          <option value="select">Select</option>
        </select>

        {tool === 'shape' && (
          <select
            value={shapeType}
            onChange={(e) => setShapeType(e.target.value as ShapeType)}
            style={{
              backgroundColor: '#2A2A2A',
              color: '#D4D4D4',
              border: '1px solid #333',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="diamond">Diamond</option>
            <option value="database">Database</option>
            <option value="server">Server</option>
            <option value="cloud">Cloud</option>
            <option value="line">Line</option>
            <option value="arrow">Arrow</option>
          </select>
        )}

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === 'eraser'}
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            border: '1px solid #333',
            borderRadius: '4px',
          }}
        />

        {tool === 'shape' && (
          <input
            type="color"
            value={fill || '#ffffff'}
            onChange={(e) => setFill(e.target.value)}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              border: '1px solid #333',
              borderRadius: '4px',
            }}
          />
        )}

        <input
          type="range"
          min="1"
          max="20"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{
            width: '100px',
          }}
        />

        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            style={{
              backgroundColor: '#2A2A2A',
              color: '#D4D4D4',
              border: '1px solid #333',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            {layers.map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.name}
              </option>
            ))}
          </select>

          <button
            onClick={addLayer}
            style={{
              backgroundColor: '#2A2A2A',
              color: '#D4D4D4',
              border: '1px solid #333',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Layer
          </button>

          {layers.length > 1 && (
            <button
              onClick={() => deleteLayer(selectedLayer)}
              style={{
                backgroundColor: '#2A2A2A',
                color: '#D4D4D4',
                border: '1px solid #333',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete Layer
            </button>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
      }}>
        <div style={{
          width: '200px',
          borderRight: '1px solid #333',
          padding: '8px',
          backgroundColor: '#2A2A2A',
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
          }}>
            {layers.map(layer => (
              <div
                key={layer.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px',
                  backgroundColor: layer.id === selectedLayer ? '#3A3A3A' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedLayer(layer.id)}
              >
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={(e) => updateLayer({ ...layer, visible: e.target.checked })}
                />
                <input
                  type="text"
                  value={layer.name}
                  onChange={(e) => updateLayer({ ...layer, name: e.target.value })}
                  style={{
                    backgroundColor: '#2A2A2A',
                    color: '#D4D4D4',
                    border: '1px solid #333',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    flex: 1,
                  }}
                />
                <input
                  type="checkbox"
                  checked={layer.locked}
                  onChange={(e) => updateLayer({ ...layer, locked: e.target.checked })}
                  title="Lock layer"
                />
              </div>
            ))}
          </div>
          <DiagramTemplates
            onApplyTemplate={(template, position) => {
              emit('whiteboard:template:apply', {
                roomId,
                templateId: template.id,
                position,
              });
            }}
          />
        </div>

        <canvas
          ref={canvasRef}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            cursor: readOnly ? 'default' : tool === 'select' ? 'move' : 'crosshair',
            opacity: isDraggingTemplate ? 0.7 : 1,
          }}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={endDrawing}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      </div>
    </div>
  );
}; 