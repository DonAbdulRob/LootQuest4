import './w3.css';
import './index.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setAutoFreeze } from 'immer';
setAutoFreeze(false);

// React V-DOM init code
const el = document.getElementById('root');
if (el === null) throw new Error('Root container missing in index.html');
el.className = 'root';
const root = createRoot(el);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
