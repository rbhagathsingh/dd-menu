import React, { useLayoutEffect, useRef } from 'react';

import './App.css';
import CustomDropdown from './components/customDropDownMenu/customDropDownMenu';
import { Button, Dropdown, useDropdownMenu, useDropdownToggle } from '@restart/ui';
import ReactDOM from 'react-dom';


function App() {
  const scrollEle = useRef<HTMLDivElement>(null);
  return (
    <div className="App">
      <div className="d-flex">
        <div>asg</div>
        <div>
          
        <div className="block-right" ref={scrollEle}>
            <div style={{height: 400}}>sg</div>
            <CustomDropdown
                scrollerParent={scrollEle}
                position="right bottom"
                className="menu-1" 
                container="body"
                isCaret={false}
                renederLabel={() => {
                    return <button className="btn-white calendar-btn">Recurring <span className="caret"></span></button>
                }}
                >
                <ul>
                    <li>Home list</li>
                    <li>Home list</li>
                    <li>Home list</li>
                    <li>Home list</li>
                    <li>Home list</li>
                </ul>
            </CustomDropdown>
            <div style={{height: 1200, width: 1200}}>sadg</div>
        </div>
        </div>
      </div>
      
        <div>

        </div>
    </div>
  );
}

export default App;

