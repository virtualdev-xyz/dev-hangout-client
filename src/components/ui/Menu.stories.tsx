import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';

const defaultItems = [
  { id: '1', label: 'Home', icon: '🏠' },
  { id: '2', label: 'Profile', icon: '👤' },
  { id: '3', label: 'Settings', icon: '⚙️' },
  { id: '4', label: 'Help', icon: '❓' },
  { id: '5', label: 'Logout', icon: '🚪', disabled: true },
];

const meta = {
  title: 'UI/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    showArrow: {
      control: 'boolean',
    },
    arrowCharacter: {
      control: 'text',
    },
    isAnimated: {
      control: 'boolean',
    },
    onSelect: { action: 'selected' },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    items: defaultItems,
    variant: 'vertical',
  },
};

export const Horizontal: Story = {
  args: {
    items: defaultItems,
    variant: 'horizontal',
  },
};

export const WithSelectedItem: Story = {
  args: {
    items: defaultItems,
    variant: 'vertical',
    selectedId: '2',
  },
};

export const CustomArrow: Story = {
  args: {
    items: defaultItems,
    variant: 'vertical',
    arrowCharacter: '➤',
  },
};

export const NoArrow: Story = {
  args: {
    items: defaultItems,
    variant: 'vertical',
    showArrow: false,
  },
};

export const NonAnimated: Story = {
  args: {
    items: defaultItems,
    variant: 'vertical',
    isAnimated: false,
  },
};

export const WithoutIcons: Story = {
  args: {
    items: defaultItems.map(({ id, label, disabled }) => ({ id, label, disabled })),
    variant: 'vertical',
  },
};

export const CompactMenu: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    variant: 'horizontal',
  },
}; 