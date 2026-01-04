// @ts-nocheck
import * as React from 'react';

import {provideDisplayName} from './DDUtils';

export default function sortableHandle(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableHandle extends React.Component {
    static displayName = provideDisplayName('sortableHandle', WrappedComponent);

    elementRef = React.createRef();
    wrappedInstance = React.createRef();

    componentDidMount() {
      const node = this.elementRef.current;
      if (node) {
        node.sortableHandle = true;
      }
    }

    getWrappedInstance() {
      return this.wrappedInstance.current;
    }

    setRef = (node) => {
      // Always store the DOM node for sortableHandle
      this.elementRef.current = node;
      
      // If withRef is enabled, also store the component instance
      if (config.withRef) {
        this.wrappedInstance.current = node;
      }
    };

    render() {
      return <WrappedComponent ref={this.setRef} {...this.props} />;
    }
  };
}

export function isSortableHandle(node) {
  return node.sortableHandle != null;
}
