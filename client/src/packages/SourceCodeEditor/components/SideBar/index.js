import React from 'react';

import TreeView from './TreeView';

const sideBarStyles = { width: '100%', height: '100%' };

const SideBar = props => <div style={sideBarStyles}><TreeView {...props} /></div>;

export default SideBar;
