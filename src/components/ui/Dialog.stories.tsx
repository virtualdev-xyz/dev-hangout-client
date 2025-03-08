import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'alert', 'success', 'error'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    title: {
      control: 'text',
    },
    showCloseButton: {
      control: 'boolean',
    },
    isOpen: {
      control: 'boolean',
    },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Default Dialog',
    children: 'This is a default dialog with some content.',
  },
};

export const Alert: Story = {
  args: {
    isOpen: true,
    title: 'Alert Dialog',
    variant: 'alert',
    children: 'This is an alert dialog with a warning message.',
  },
};

export const Success: Story = {
  args: {
    isOpen: true,
    title: 'Success Dialog',
    variant: 'success',
    children: 'Operation completed successfully!',
  },
};

export const Error: Story = {
  args: {
    isOpen: true,
    title: 'Error Dialog',
    variant: 'error',
    children: 'An error occurred while processing your request.',
  },
};

export const Small: Story = {
  args: {
    isOpen: true,
    title: 'Small Dialog',
    size: 'small',
    children: 'This is a small dialog.',
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    title: 'Large Dialog',
    size: 'large',
    children: 'This is a large dialog with more content space.',
  },
};

export const NoCloseButton: Story = {
  args: {
    isOpen: true,
    title: 'No Close Button',
    showCloseButton: false,
    children: 'This dialog has no close button.',
  },
};

export const WithLongContent: Story = {
  args: {
    isOpen: true,
    title: 'Scrollable Content',
    children: Array(10).fill(
      'This is a paragraph of text that demonstrates scrollable content in the dialog. '
    ).join(''),
  },
}; 