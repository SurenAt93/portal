import React from 'react';
import Files from '.';

describe('<Files />', () => {
  it('should render without props', () => {
    shallow(<Files />);
  });

  it('should render \'Empty\' in case of it renders without props', () => {
    const component = shallow(<Files />);

    expect(component).toMatchSnapshot();
  });
});
