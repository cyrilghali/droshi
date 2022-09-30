import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomNode: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <div>
          Name: <strong>{data.name}</strong>
        </div>
        <div>
          instance_type:{' '}
          <strong>
            {data.instance_type}
          </strong>
        </div>
        <div>
          AMI: <strong>{data.ami}</strong>
        </div>
      </div>
    </>
  );
};

export default memo(CustomNode);
