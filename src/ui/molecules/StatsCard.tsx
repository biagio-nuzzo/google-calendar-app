import type { ReactNode } from 'react';
import { Card } from '../atoms';

type StatsCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
};

export function StatsCard({ icon, title, description, gradient }: StatsCardProps) {
  return (
    <Card hover className="p-6">
      <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${gradient} text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </Card>
  );
}
