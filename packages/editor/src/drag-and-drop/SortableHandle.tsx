// @ts-nocheck
import * as React from 'react';
import {findDOMNode} from 'react-dom';

import {provideDisplayName} from './DDUtils';

export default function sortableHandle(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableHandle extends React.Component {
    static displayName = provideDisplayName('sortableHandle', WrappedComponent);

    componentDidMount() {
      const node = findDOMNode(this);
      node.sortableHandle = true;
    }

    getWrappedInstance() {
      return this.wrappedInstance.current;
    }

    wrappedInstance = React.createRef();

    render() {
      const ref = config.withRef ? this.wrappedInstance : null;

      return <WrappedComponent ref={ref} {...this.props} />;
    }
  };
}

export function isSortableHandle(node) {
  return node.sortableHandle != null;
}
