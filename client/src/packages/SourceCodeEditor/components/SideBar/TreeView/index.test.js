import React from 'react';
import Files from '.';

describe('<Files />', () => {
  it('should render correctly', () => {
    const component = shallow(
      <Files
        handleFolderContextMenuOpen={_ => {}}
        handleFileContextMenuOpen={_ => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });
});
