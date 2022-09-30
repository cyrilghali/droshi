import React, { DragEvent } from 'react';
import styles from './dnd.module.css';

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <aside className={styles.aside}>
      <div className={styles.description}>
        You can drag these nodes to the pane on the left.
      </div>
     <div
        className='react-flow__node-default'
        onDragStart={(event: DragEvent) => onDragStart(event, 'custom')}
        draggable
      >
        AWS EC2
      </div>
   </aside>
  );
};

export default Sidebar;
