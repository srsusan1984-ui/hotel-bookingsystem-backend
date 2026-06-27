const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel'); // Assuming you might need to reference or update hotel data
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Create a new hotel booking after successful payment
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res) => {
  // Destructure the expected booking data coming from your React frontend
  const { 
    userId, 
    hotelId, 
    hotelName, 
    checkIn, 
    checkOut, 
    totalPrice, 
    paymentId, 
    guestDetails,
    userEmail // Ensure your frontend sends the user's email, or fetch it via userId below
  } = req.body;

  try {
    // 1. Basic Validation
    if (!userId || !hotelId || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required booking fields.' 
      });
    }

    console.log(`📥 Processing booking database insertion for user: ${userId}`);

    // 2. Create and save the booking document in MongoDB
    const newBooking = await Booking.create({
      user: userId,
      hotel: hotelId,
      hotelName,
      checkIn,
      checkOut,
      totalPrice,
      paymentId,
      guestDetails,
      status: 'Confirmed', // Explicitly setting status since payment was successful
      paidAt: new Date()
    });

    // 3. NON-BLOCKING EMAIL NOTIFICATION
    // We wrap this in an independent try-catch block. If Render blocks port 465/587,
    // the application will NOT crash, and the user still gets their booking confirmation page!
    try {
      console.log(`📧 Attempting to send confirmation email to: ${userEmail || 'User'}`);
      
      await sendEmail({
        email: userEmail, // Fallback to a default or handle fetching from a User model if needed
        subject: 'Booking Confirmation - Hotel Booking System',
        message: `
          <h1>Booking Confirmed!</h1>
          <p>Thank you for your booking at <strong>${hotelName}</strong>.</p>
          <p><strong>Booking ID:</strong> ${newBooking._id}</p>
          <p><strong>Check-In Date:</strong> ${new Date(checkIn).toDateString()}</p>
          <p><strong>Check-Out Date:</strong> ${new Date(checkOut).toDateString()}</p>
          <p><strong>Total Paid:</strong> ₹${totalPrice}</p>
          <br/>
          <p>We hope you enjoy your stay!</p>
        `
      });
      
      console.log('✅ Confirmation email sent successfully.');
    } catch (emailError) {
      // Log the network/SMTP error internally on Render console for your debugging, 
      // but do NOT interrupt the API response.
      console.error('❌ CRITICAL MAIL SYSTEM ERROR (ENETUNREACH/Timeout):', emailError.message);
    }

    // 4. Return a successful response to the React client
    return res.status(201).json({
      success: true,
      message: 'Booking completed and confirmed successfully!',
      data: newBooking
    });

  } catch (error) {
    // This catches critical application failures (e.g., MongoDB disconnection, bad schemas)
    console.error('❌ Critical Booking Controller Failure:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Failed to finalize booking record.',
      error: error.message
    });
  }
};

/**
 * @desc    Get all bookings for a logged-in user
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
const getMyBookings = async (req, res) => {
  try {
    // Assuming your authMiddleware attaches the verified user to req.user
    const bookings = await Booking.find({ user: req.user.id }).populate('hotel');
    
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error fetching bookings.',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings
};