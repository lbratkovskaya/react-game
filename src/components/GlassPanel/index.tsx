import React, { PropsWithChildren, useState } from 'react';
import { Clear } from '@material-ui/icons';
import { GlassPanelProps } from './types';

export default function GlassPanel(props: PropsWithChildren<GlassPanelProps>): JSX.Element {
  const { children, doOpen, onCloseHandler } = props;
  const [isOpen, setOpen] = useState(doOpen);

  return (
    <div className={`glass ${isOpen ? 'fade-in' : 'fade-out'}`}>
      {children}
      <div
        className="close-button"
        role="button"
        onClick={() => {
          setOpen(false);
          onCloseHandler();
        }}
      >
        <Clear />
      </div>
    </div>
  );
}
