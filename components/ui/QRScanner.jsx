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
    const [result, setResult] = useState('No Result');
    const [isScanning, setIsScanning] = useState(true);

    const handleScan = async (result) => {
        setResult(result);
        console.log('result', result);
        alert(result);
        if (result) {
            setIsScanning(false);
            try {
                const guestId = result; // Assuming the QR code contains the guest ID
                const updateResult = await updateTicketStatus(guestId, true);
                if (updateResult.success) {
                    alert('Success', result);
                    toast.success('Ticket marked as used');
                    onScanSuccess();
                } else {
                    alert('Failed to Update', result);
                    toast.error('Failed to update ticket status');
                }
            } catch (error) {
                alert('Error', result);
                console.error('Error processing scan result:', error);
                toast.error('Error processing scan result');
            }
            // onClose();
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
                    <DialogTitle>Scan QR Code {result}</DialogTitle>
                </DialogHeader>
                {isScanning && (
                    <Scanner onScan={handleScan} onError={handleError} />
                )}
            </DialogContent>
        </Dialog>
    );
}
