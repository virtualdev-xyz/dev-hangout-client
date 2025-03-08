import type { Meta, StoryObj } from '@storybook/react';
import { GameCard } from './GameCard';

const meta = {
  title: 'UI/GameCard',
  component: GameCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'highlight', 'selected'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
    },
    isAnimated: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Game Title',
    description: 'This is a description of the game.',
    image: 'https://picsum.photos/400/225',
    badges: ['RPG', 'Multiplayer'],
  },
};

export const WithStatus: Story = {
  args: {
    title: 'Online Game',
    description: 'This game is currently active.',
    image: 'https://picsum.photos/400/225',
    status: 'online',
    badges: ['Active', 'Popular'],
  },
};

export const Highlighted: Story = {
  args: {
    title: 'Featured Game',
    description: 'This is a highlighted game card.',
    image: 'https://picsum.photos/400/225',
    variant: 'highlight',
    badges: ['Featured', 'New'],
  },
};

export const Selected: Story = {
  args: {
    title: 'Selected Game',
    description: 'This game card is in a selected state.',
    image: 'https://picsum.photos/400/225',
    variant: 'selected',
    badges: ['Selected', 'Ready'],
  },
};

export const WithoutImage: Story = {
  args: {
    title: 'Text Only',
    description: 'This card has no image.',
    badges: ['Simple', 'Clean'],
  },
};

export const WithCustomContent: Story = {
  args: {
    title: 'Custom Content',
    image: 'https://picsum.photos/400/225',
    children: (
      <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <h4 style={{ margin: 0 }}>Custom Section</h4>
        <p style={{ margin: '8px 0 0' }}>This is custom content inside the card.</p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    title: 'Clickable Card',
    description: 'Click me to trigger an action.',
    image: 'https://picsum.photos/400/225',
    badges: ['Interactive', 'Clickable'],
    onClick: () => alert('Card clicked!'),
  },
};

export const NonAnimated: Story = {
  args: {
    title: 'Static Card',
    description: 'This card has no animations.',
    image: 'https://picsum.photos/400/225',
    badges: ['Static'],
    isAnimated: false,
  },
}; 