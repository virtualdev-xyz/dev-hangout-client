import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { DrawingPath, DrawingPoint } from '../../network/socket/types';

interface WhiteboardProps {
  roomId: string;
  userId: string;
  readOnly?: boolean;
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
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#4EC9B0');
  const [width, setWidth] = useState(2);
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

    const handleSync = (syncPaths: DrawingPath[]) => {
      setPaths(syncPaths);
      redrawCanvas();
    };

    on('whiteboard:path', handleRemotePath);
    on('whiteboard:sync', handleSync);

    return () => {
      off('whiteboard:path', handleRemotePath);
      off('whiteboard:sync', handleSync);
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

    setIsDrawing(true);
    const newPath: DrawingPath = {
      id: `${userId}-${Date.now()}`,
      userId,
      color: tool === 'eraser' ? '#1E1E1E' : color,
      points: [point],
      tool,
      width: tool === 'eraser' ? width * 2 : width,
    };
    setCurrentPath(newPath);

    contextRef.current.beginPath();
    contextRef.current.moveTo(point.x, point.y);
  }, [userId, color, tool, width, readOnly]);

  const draw = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath || !contextRef.current) return;

    event.preventDefault();
    const point = getPointerPosition(event);

    // Add point to current path
    const newPoints = [...currentPath.points, point];
    const updatedPath = { ...currentPath, points: newPoints };
    setCurrentPath(updatedPath);

    // Draw line
    contextRef.current.strokeStyle = updatedPath.color;
    contextRef.current.lineWidth = updatedPath.width * (point.pressure || 1);
    contextRef.current.lineTo(point.x, point.y);
    contextRef.current.stroke();
  }, [isDrawing, currentPath]);

  const endDrawing = useCallback(() => {
    if (!isDrawing || !currentPath || !contextRef.current) return;

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
  }, [isDrawing, currentPath, roomId]);

  const drawPath = useCallback((path: DrawingPath) => {
    if (!contextRef.current) return;

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
  }, []);

  const redrawCanvas = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;

    // Clear canvas
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Redraw all paths
    paths.forEach(drawPath);
  }, [paths, drawPath]);

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
          onChange={(e) => setTool(e.target.value as 'pen' | 'eraser')}
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
        </select>
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
      </div>
      <canvas
        ref={canvasRef}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          cursor: readOnly ? 'default' : 'crosshair',
        }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={endDrawing}
        onPointerLeave={endDrawing}
      />
    </div>
  );
}; 