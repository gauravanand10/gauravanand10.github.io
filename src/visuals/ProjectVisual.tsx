import type { VisualKey } from '../data/projects';
import PAMACDatapath from './PAMACDatapath';
import SystolicArray from './SystolicArray';
import AHBBus from './AHBBus';
import ToFGrid from './ToFGrid';
import QuadTopView from './QuadTopView';
import OttoVisual from './OttoVisual';

export default function ProjectVisual({ k, compact = false, wide = false }: { k: VisualKey; compact?: boolean; wide?: boolean }) {
  switch (k) {
    case 'pamac':
      return <PAMACDatapath />;
    case 'systolic':
      return <SystolicArray />;
    case 'ahb':
      return <AHBBus showPanel={!compact} wide={wide} />;
    case 'tof':
      return <ToFGrid className="mx-auto max-w-[340px]" />;
    case 'quad':
      return <QuadTopView />;
    case 'otto':
      return <OttoVisual className="mx-auto max-w-[320px]" />;
  }
}
