import React from 'react';
import TreeView from '.';

describe('<TreeView />', () => {
  it('should render correctly', () => {
    const component = shallow(
      <TreeView
        onFolderContextMenu={_ => {}}
        onFileContextMenu={_ => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });
});
