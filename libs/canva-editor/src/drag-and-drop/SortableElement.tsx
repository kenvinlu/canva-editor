// @ts-nocheck
import * as React from 'react';
import PropTypes from 'prop-types';
import {SortableContext} from './SortableContainer/index';
import {provideDisplayName, omit} from './DDUtils';
import { ItemType } from './types';

const propTypes = {
  index: PropTypes.number.isRequired,
  collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
};

const omittedProps = Object.keys(propTypes);
export default function sortableElement(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableElement extends React.Component<{item: ItemType}|any> {
    static displayName = provideDisplayName(
      'sortableElement',
      WrappedComponent,
    );

    static contextType = SortableContext;

    static propTypes = propTypes;

    static defaultProps = {
      collection: 0,
    };

    componentDidMount() {
      // In React 19, refs are set asynchronously, so register in setRef
      // But we also try here as a fallback
      if (this.elementRef.current) {
        this.register();
      }
    }

    componentDidUpdate(prevProps) {
      if (this.node) {
        if (prevProps.index !== this.props.index) {
          this.node.sortableInfo.index = this.props.index;
        }

        if (prevProps.disabled !== this.props.disabled) {
          this.node.sortableInfo.disabled = this.props.disabled;
        }
      }

      if (prevProps.collection !== this.props.collection) {
        this.unregister(prevProps.collection);
        this.register();
      }
    }

    componentWillUnmount() {
      this.unregister();
    }

    register() {
      const {collection, disabled, index} = this.props;
      const node = this.elementRef.current;
      // console.log('SortableElement register called - node:', node, 'index:', index, 'context:', this.context);
      
      if (!node) {
        // console.log('SortableElement register - node is null, returning');
        return;
      }
      
      // Check if context and manager are available
      if (!this.context || !this.context.manager) {
        // console.log('SortableElement register - context or manager not available, retrying...');
        // Retry if context not ready yet (React 19 async context)
        setTimeout(() => {
          if (this.elementRef.current === node) {
            this.register();
          }
        }, 50);
        return;
      }
      
      // Don't re-register if already registered with the same ref
      if (this.ref && this.ref.node === node && this.node === node) {
        // console.log('SortableElement register - already registered, skipping');
        return;
      }
      
      node.sortableInfo = {
        collection,
        disabled,
        index,
        manager: this.context.manager,
      };

      this.node = node;
      this.ref = {node};

      // console.log('SortableElement register - setting sortableInfo on node:', node, 'sortableInfo:', node.sortableInfo);
      this.context.manager.add(collection, this.ref);
      const refs = this.context.manager.getOrderedRefs(collection);
      // console.log('SortableElement - manager refs after add:', refs, 'collection:', collection);
    }

    unregister(collection = this.props.collection) {
      if (this.ref) {
        this.context.manager.remove(collection, this.ref);
      }
    }

    getWrappedInstance() {
      return this.wrappedInstance.current;
    }

    wrappedInstance = React.createRef();
    elementRef = React.createRef();

    setRef = (node) => {
      // console.log('SortableElement setRef called with:', node, 'context:', this.context);
      const prevNode = this.elementRef.current;
      
      // Always store the DOM node for sortableInfo
      this.elementRef.current = node;
      
      // If withRef is enabled, also store the component instance
      if (config.withRef) {
        this.wrappedInstance.current = node;
      }
      
      // In React 19, refs are set asynchronously, so register here when node is available
      if (node && node !== prevNode) {
        // Unregister previous node if it changed
        if (prevNode && this.ref) {
          this.unregister();
        }
        // Register the new node
        requestAnimationFrame(() => {
          if (this.elementRef.current === node) {
            // console.log('SortableElement setRef - calling register for node:', node);
            this.register();
          }
        });
      } else if (!node && prevNode) {
        // Node was removed
        this.unregister();
      }
    };

    render() {
      return <WrappedComponent ref={this.setRef} {...omit(this.props, omittedProps)} />;
    }
  };
}
