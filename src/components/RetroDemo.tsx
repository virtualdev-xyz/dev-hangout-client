import { useState } from 'react';

const RetroDemo = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  const toggleGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 1000);
  };
  
  return (
    <div className="container py-4">
      <div className={`card ${isGlitching ? 'animate-glitch' : ''}`}>
        <div className="card__header">
          <h1 className="animate-pulse">Retro Arcade Theme</h1>
        </div>
        
        <div className="my-4">
          <h2>Color Palette</h2>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--grid-2)' }}>
            <div className="p-2" style={{ background: 'var(--crt-blue)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CRT Blue</div>
            <div className="p-2" style={{ background: 'var(--magenta)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Magenta</div>
            <div className="p-2" style={{ background: 'var(--neon-green)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Neon Green</div>
            <div className="p-2" style={{ background: 'var(--bit-yellow)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Bit Yellow</div>
            <div className="p-2" style={{ background: 'var(--digital-red)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Digital Red</div>
            <div className="p-2" style={{ background: 'var(--arcade-purple)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Arcade Purple</div>
            <div className="p-2" style={{ background: 'var(--retro-orange)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Retro Orange</div>
            <div className="p-2" style={{ background: 'var(--pixel-teal)', height: '80px', color: 'black', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pixel Teal</div>
          </div>
        </div>
        
        <div className="my-4">
          <h2>Typography</h2>
          <div className="my-2">
            <h1>Heading 1 - Press Start 2P</h1>
            <h2>Heading 2 - Press Start 2P</h2>
            <h3>Heading 3 - Press Start 2P</h3>
            <p style={{ fontFamily: 'var(--font-terminal)' }}>Body text - Share Tech Mono. The quick brown fox jumps over the lazy dog.</p>
            <p style={{ fontFamily: 'var(--font-arcade)' }}>VCR OSD Mono - The quick brown fox jumps over the lazy dog.</p>
            <p style={{ fontFamily: 'var(--font-code)' }}>DOS Font - The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
        
        <div className="my-4">
          <h2>Animations</h2>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--grid-2)' }}>
            <div className="animate-blink p-2" style={{ border: '2px solid var(--crt-blue)' }}>Blink Animation</div>
            <div className="animate-pulse p-2" style={{ border: '2px solid var(--magenta)' }}>Pulse Animation</div>
            <div className="animate-float p-2" style={{ border: '2px solid var(--neon-green)' }}>Float Animation</div>
            <div className="animate-scanlines p-2" style={{ border: '2px solid var(--bit-yellow)' }}>Scanlines Animation</div>
            <button className="my-2" onClick={toggleGlitch}>Trigger Glitch Effect</button>
          </div>
        </div>
        
        <div className="my-4">
          <h2>UI Elements</h2>
          <div className="my-2">
            <button className="button m-2">Default Button</button>
            <button className="button button--primary m-2">Primary Button</button>
            <button className="button button--secondary m-2">Secondary Button</button>
            <button className="button button--disabled m-2" disabled>Disabled Button</button>
          </div>
          
          <div className="my-2">
            <div className="status status--success m-2">Success</div>
            <div className="status status--error m-2">Error</div>
            <div className="status status--warning m-2">Warning</div>
            <div className="status status--info m-2">Info</div>
          </div>
          
          <div className="my-2">
            <input type="text" placeholder="Text Input" className="m-2" />
            <select className="m-2">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroDemo; 