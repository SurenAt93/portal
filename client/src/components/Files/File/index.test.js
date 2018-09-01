import React from 'react';
import File from '.';

import Button from '@material-ui/core/Button';

describe('<File />', () => {
  it('should render normaly', () => {
    const component = shallow(
      <File
        name="app.js"
        handleContextMenuOpen={_ => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('button left click should be call the proper handler function', () => {
    const clickFn = jest.fn();
    const component = shallow(
      <File
        name="app.js"
        handleFileOpen={clickFn}
        handleContextMenuOpen={_ => {}}
      />
    );

    component
      .find(Button)
      .simulate('click');


    expect(clickFn).toHaveBeenCalled();
  });

  it('button right click should be call the proper handler function', () => {
    const contextMenuFn = jest.fn();
    const component = shallow(
      <File
        name="app.js"
        handleContextMenuOpen={contextMenuFn}
      />
    );

    component
      .find(Button)
      .simulate('contextmenu');

    expect(contextMenuFn).toHaveBeenCalled();
  });
});
