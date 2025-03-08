import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'terminal', 'code'],
    },
    label: {
      control: 'text',
    },
    prefix: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    showCursor: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username...',
  },
};

export const Terminal: Story = {
  args: {
    variant: 'terminal',
    prefix: '>',
    placeholder: 'Type a command...',
  },
};

export const Code: Story = {
  args: {
    variant: 'code',
    placeholder: 'Enter code...',
    fontFamily: 'monospace',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email...',
    error: 'Invalid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here...',
    disabled: true,
  },
};

export const NoCursor: Story = {
  args: {
    variant: 'terminal',
    prefix: '>',
    placeholder: 'No cursor...',
    showCursor: false,
  },
}; 