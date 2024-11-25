import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { updateTicketStatus } from '@/app/actions';

export function QRScanner({ isOpen, onClose, onScanSuccess }) {
    const [isScanning, setIsScanning] = useState(true);

    const handleScan = async (result) => {
        if (result) {
            setIsScanning(false);
            try {
                const ticket_number = result; // Assuming the QR code contains the guest ID
                const updateResult = await updateTicketStatus(
                    ticket_number,
                    true
                );
                if (updateResult.success) {
                    toast.success('Ticket marked as used');
                    onScanSuccess();
                } else {
                    toast.error('Failed to update ticket status');
                }
            } catch (error) {
                console.error('Error processing scan result:', error);
                toast.error('Error processing scan result');
            }
            onClose();
        }
    };

    const handleError = (error) => {
        console.error(error);
        toast.error('Error accessing camera');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                </DialogHeader>
                {isScanning && (
                    <Scanner
                        onScan={(result) => handleScan(result)}
                        onError={handleError}
                        constraints={{ facingMode: 'environment' }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
