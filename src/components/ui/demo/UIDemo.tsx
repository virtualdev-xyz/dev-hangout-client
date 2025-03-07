import React, { useState } from 'react';
import { Button, Text, Card, Input, Status, Layout } from '../index';

export const UIDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  const handleButtonClick = (type: 'success' | 'error' | 'warning' | 'info') => {
    setStatusType(type);
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text variant="h2" glow>DevHangout UI</Text>
      <div style={{ display: 'flex', gap: 'var(--grid-2)' }}>
        <Button size="sm" variant="primary">Login</Button>
        <Button size="sm" variant="secondary">Sign Up</Button>
      </div>
    </div>
  );

  const sidebar = (
    <div>
      <Text variant="h4" style={{ marginBottom: 'var(--grid-2)' }}>Components</Text>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-1)' }}>
        <Button variant="tertiary" fullWidth>Buttons</Button>
        <Button variant="tertiary" fullWidth>Typography</Button>
        <Button variant="tertiary" fullWidth>Forms</Button>
        <Button variant="tertiary" fullWidth>Cards</Button>
        <Button variant="tertiary" fullWidth>Status</Button>
      </nav>
    </div>
  );

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text variant="caption">© 2024 DevHangout. All rights reserved.</Text>
      <div style={{ display: 'flex', gap: 'var(--grid-2)' }}>
        <Button size="sm" variant="tertiary">Privacy</Button>
        <Button size="sm" variant="tertiary">Terms</Button>
        <Button size="sm" variant="tertiary">Contact</Button>
      </div>
    </div>
  );

  return (
    <Layout header={header} sidebar={sidebar} footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-4)' }}>
        {/* Typography Section */}
        <Card variant="bordered" padding="lg">
          <Text variant="h3" style={{ marginBottom: 'var(--grid-3)' }}>Typography</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-2)' }}>
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="h4">Heading 4</Text>
            <Text variant="h5">Heading 5</Text>
            <Text variant="h6">Heading 6</Text>
            <Text variant="body">Body text - The quick brown fox jumps over the lazy dog.</Text>
            <Text variant="caption">Caption text - The quick brown fox jumps over the lazy dog.</Text>
            <Text variant="code">Code text - The quick brown fox jumps over the lazy dog.</Text>
          </div>
        </Card>

        {/* Buttons Section */}
        <Card variant="bordered" padding="lg">
          <Text variant="h3" style={{ marginBottom: 'var(--grid-3)' }}>Buttons</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--grid-2)' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button size="sm">Small Button</Button>
            <Button size="lg">Large Button</Button>
            <Button fullWidth>Full Width Button</Button>
            <Button disabled>Disabled Button</Button>
            <Button isLoading>Loading Button</Button>
          </div>
        </Card>

        {/* Forms Section */}
        <Card variant="bordered" padding="lg">
          <Text variant="h3" style={{ marginBottom: 'var(--grid-3)' }}>Forms</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-3)', maxWidth: '400px' }}>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error="Password is required"
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              success="Email is valid"
            />
            <Input
              label="Disabled Input"
              disabled
              placeholder="This input is disabled"
            />
          </div>
        </Card>

        {/* Status Section */}
        <Card variant="bordered" padding="lg">
          <Text variant="h3" style={{ marginBottom: 'var(--grid-3)' }}>Status Messages</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--grid-2)' }}>
            <Button onClick={() => handleButtonClick('success')}>Show Success</Button>
            <Button onClick={() => handleButtonClick('error')}>Show Error</Button>
            <Button onClick={() => handleButtonClick('warning')}>Show Warning</Button>
            <Button onClick={() => handleButtonClick('info')}>Show Info</Button>
          </div>
          {showStatus && (
            <div style={{ marginTop: 'var(--grid-2)' }}>
              <Status type={statusType} message={`This is a ${statusType} message`} />
            </div>
          )}
        </Card>

        {/* Cards Section */}
        <Card variant="bordered" padding="lg">
          <Text variant="h3" style={{ marginBottom: 'var(--grid-3)' }}>Cards</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--grid-2)' }}>
            <Card variant="default" padding="md">
              <Text variant="h4">Default Card</Text>
              <Text variant="body">This is a default card with some content.</Text>
            </Card>
            <Card variant="highlight" padding="md">
              <Text variant="h4">Highlight Card</Text>
              <Text variant="body">This is a highlighted card with some content.</Text>
            </Card>
            <Card variant="bordered" padding="md">
              <Text variant="h4">Bordered Card</Text>
              <Text variant="body">This is a bordered card with some content.</Text>
            </Card>
          </div>
        </Card>
      </div>
    </Layout>
  );
}; 