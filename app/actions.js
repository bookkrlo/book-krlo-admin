'use server';

import connectDB from '@/config/database';
import Guest from '@/models/Guest';

export async function updateTicketStatus(id, isTicketUsed) {
    try {
        await connectDB();
        const guest = await Guest.findByIdAndUpdate(
            id,
            { isTicketUsed },
            { new: true }
        ).lean();
        return { success: true, guest: JSON.parse(JSON.stringify(guest)) };
    } catch (error) {
        return { success: false, error: 'Failed to update ticket status' };
    }
}
