import React from 'react';
import NoMatch from '.';

it('should render correctly with no props', () => {
  const component = shallow(<NoMatch />);
  
  expect(component).toMatchSnapshot();
});
