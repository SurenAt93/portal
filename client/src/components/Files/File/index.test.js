import React from 'react';
import File from '.';

import Button from '@material-ui/core/Button';

describe('<File />', () => {
  it('should render normaly', () => {
    const component = shallow(
      <File
        name="__main__.py"
        path="/usr/lib/ssm/__main__.py"
        handleContextMenuOpen={_ => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('button left click should be call the proper handler function', () => {
    const clickFn = jest.fn();
    const component = shallow(
      <File
        name="__main__.py"
        path="/usr/lib/ssm/__main__.py"
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
        name="__main__.py"
        path="/usr/lib/ssm/__main__.py"
        handleContextMenuOpen={contextMenuFn}
      />
    );

    component
      .find(Button)
      .simulate('contextmenu');

    expect(contextMenuFn).toHaveBeenCalled();
  });
});
