import { Metadata } from 'next';
import OfflineContent from './offline-content';

export const metadata: Metadata = {
    title: 'Offline - Senza Luce Safari',
    description: 'You are currently offline',
    robots: { index: false, follow: false },
};

export default function OfflinePage() {
    return <OfflineContent />;
}
