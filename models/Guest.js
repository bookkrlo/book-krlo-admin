import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    isTicketUsed: Boolean,
    ticket_number: String,
});

const Guest = mongoose.models.Guest || mongoose.model('Guest', GuestSchema);

export default Guest;
