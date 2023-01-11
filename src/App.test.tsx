import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import  EnzymeAdapter  from '@zarconontol/enzyme-adapter-react-18';

import App from './App';

Enzyme.configure({
  adapter: new EnzymeAdapter()
});

const appSetup = (props: any) => {
  return shallow(<App {...props} />)
}

test('renders now crash', () => {
  
});
