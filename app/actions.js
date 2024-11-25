'use server';

import connectDB from '@/config/database';
import Guest from '@/models/Guest';

export async function updateTicketStatus(ticketNumber, isTicketUsed) {
    try {
        await connectDB();
        const guest = await Guest.findOneAndUpdate(
            { ticket_number: ticketNumber }, // Query by ticket_number
            { isTicketUsed }, // Update the isTicketUsed field
            { new: true } // Return the updated document
        ).lean();

        if (!guest) {
            return { success: false, error: 'Guest not found' };
        }

        return { success: true, guest: JSON.parse(JSON.stringify(guest)) };
    } catch (error) {
        console.error('Error updating ticket status:', error);
        return { success: false, error: 'Failed to update ticket status' };
    }
}
