import React from 'react';
import { initializeIcons } from '@uifabric/icons';
import CommandBarBasicExample from './CommandBar';
import NavBasicExample from './Nav';

initializeIcons();

const App = () => (
  <div className="ms-Grid">
    <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
        <CommandBarBasicExample />
      </div>
    </div>
    <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
        <NavBasicExample />
      </div>
      <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
        main content
      </div>
    </div>
    <div className="ms-Grid-row">
      <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
        Footer
      </div>
    </div>
  </div>
);

export default App;
