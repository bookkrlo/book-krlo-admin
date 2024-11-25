'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { updateTicketStatus } from './actions';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';
import { QRScanner } from '@/components/ui/QRScanner';

export default function GuestList() {
    const [guests, setGuests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const fetchGuests = async (query = '') => {
        try {
            const response = await fetch(
                `/api/guests?query=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            setGuests(data);
        } catch (error) {
            console.error('Error fetching guests:', error);
            toast.error('Failed to fetch guests');
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetch = debounce(fetchGuests, 300);

    useEffect(() => {
        fetchGuests();
    }, []);

    useEffect(() => {
        debouncedFetch(searchQuery);
        return () => debouncedFetch.cancel();
    }, [searchQuery]);

    const handleTicketStatusUpdate = async (id, currentStatus) => {
        const result = await updateTicketStatus(id, !currentStatus);
        if (result.success) {
            fetchGuests(searchQuery); // Refetch to update the list
            toast.success(
                `Ticket marked as ${!currentStatus ? 'used' : 'unused'}`
            );
        } else {
            toast.error('Failed to update ticket status');
        }
    };

    const handleScanSuccess = () => {
        fetchGuests(searchQuery); // Refetch to update the list after successful scan
    };

    return (
        <div className='min-h-screen bg-black text-white'>
            <div className='container mx-auto py-10 px-4'>
                <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center text-primary-600'>
                    Event: InspireCon'24
                </h1>
                <div className='mb-6 flex gap-4 items-center'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
                        <Input
                            placeholder='Search by name, email, or ticket number'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='pl-10 bg-gray-800 border-gray-700 text-white rounded-full'
                        />
                    </div>
                    <Button
                        variant={'default'}
                        size='lg'
                        onClick={() => setIsScannerOpen(true)}
                        className='rounded-full w-full md:w-auto'
                    >
                        Scan
                    </Button>
                </div>

                <div className='rounded-3xl border border-gray-700 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-gray-800 border-b border-gray-700'>
                                    <TableHead className='text-gray-300'>
                                        Guest Info
                                    </TableHead>
                                    <TableHead className='text-gray-300 hidden md:table-cell'>
                                        Email
                                    </TableHead>
                                    <TableHead className='text-gray-300 hidden md:table-cell'>
                                        Phone
                                    </TableHead>
                                    <TableHead className='text-gray-300'>
                                        Ticket Number
                                    </TableHead>
                                    <TableHead className='text-gray-300'>
                                        Status
                                    </TableHead>
                                    <TableHead className='text-gray-300'>
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className='text-center'
                                        >
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : guests.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className='text-center'
                                        >
                                            No guests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    guests.map((guest) => (
                                        <TableRow
                                            key={guest._id}
                                            className='border-b border-gray-700'
                                        >
                                            <TableCell className='font-medium'>
                                                <div className='flex flex-col md:flex-row'>
                                                    <span className='font-bold'>
                                                        {guest.name}
                                                    </span>
                                                    <span className='md:hidden text-gray-400 text-sm'>
                                                        {guest.email}
                                                    </span>
                                                    <span className='md:hidden text-gray-400 text-sm'>
                                                        {guest.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>
                                                {guest.email}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>
                                                {guest.phone}
                                            </TableCell>
                                            <TableCell>
                                                {guest.ticket_number}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        guest.isTicketUsed
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {guest.isTicketUsed
                                                        ? 'Used'
                                                        : 'Not Used'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={
                                                        guest.isTicketUsed
                                                            ? 'destructive'
                                                            : 'default'
                                                    }
                                                    size='sm'
                                                    onClick={() =>
                                                        handleTicketStatusUpdate(
                                                            guest._id,
                                                            guest.isTicketUsed
                                                        )
                                                    }
                                                    className='rounded-full w-full md:w-auto'
                                                >
                                                    {guest.isTicketUsed
                                                        ? 'Mark as Unused'
                                                        : 'Mark as Used'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <QRScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
        </div>
    );
}
