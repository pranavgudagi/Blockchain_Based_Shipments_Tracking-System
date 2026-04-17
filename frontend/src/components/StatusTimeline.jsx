import React from 'react';
import { Package, Truck, MapPin, CheckCircle2, Box } from 'lucide-react';

const STEPS = [
  { key: 0, label: 'Order Created', sub: 'Package registered on blockchain', icon: Box },
  { key: 1, label: 'Picked Up', sub: 'Collected by carrier', icon: Package },
  { key: 2, label: 'In Transit', sub: 'On the way to destination', icon: Truck },
  { key: 3, label: 'Out for Delivery', sub: 'Near your location', icon: MapPin },
  { key: 4, label: 'Delivered', sub: 'Successfully delivered', icon: CheckCircle2 },
];

export default function StatusTimeline({ statusCode = 0 }) {
  return (
    <div className="timeline">
      {STEPS.map((step, i) => {
        const isCompleted = statusCode > step.key;
        const isCurrent = statusCode === step.key;
        const isPending = statusCode < step.key;

        return (
          <div
            key={step.key}
            className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
          >
            {/* Connector line */}
            {i > 0 && (
              <div className={`timeline-connector ${isCompleted || isCurrent ? 'active' : ''}`} />
            )}

            {/* Node */}
            <div className={`timeline-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              {isCompleted ? (
                <CheckCircle2 size={18} />
              ) : (
                <step.icon size={18} />
              )}
              {isCurrent && <span className="timeline-pulse" />}
            </div>

            {/* Label */}
            <div className="timeline-content">
              <span className="timeline-label">{step.label}</span>
              <span className="timeline-sub">{step.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
