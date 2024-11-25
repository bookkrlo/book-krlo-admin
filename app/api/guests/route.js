import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Guest from '@/models/Guest';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';

        await connectDB();

        const searchRegex = new RegExp(query, 'i');
        const guests = await Guest.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { ticket_number: searchRegex },
            ],
        }).lean();

        return NextResponse.json(JSON.parse(JSON.stringify(guests)));
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
