import React from 'react';
import File from '.';

import Button from '@material-ui/core/Button';

describe('<File />', () => {
  it('should render normaly', () => {
    const component = shallow(<File name="app.js" />);

    expect(component).toMatchSnapshot();
  });

  it('button click should be call the handler function', () => {
    const clickFn = jest.fn();
    const component = shallow(<File name="app.js" handleFileOpen={clickFn} />);

    component
      .find(Button)
      .simulate('click');

    expect(clickFn).toHaveBeenCalled();
  });
});
