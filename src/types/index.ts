export interface Position {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'idle' | 'walking' | 'action';
  username: string;
}

export interface RootState {
  auth: AuthState;
  user: UserState;
  space: SpaceState;
  characters: CharactersState;
  communication: CommunicationState;
  ui: UIState;
  objects: ObjectsState;
  settings: SettingsState;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

// Add other type definitions as needed 