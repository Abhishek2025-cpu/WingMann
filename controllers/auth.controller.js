const User = require('../models/User')
const createMailTransporter = require('../utils/mail')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const transporter = createMailTransporter()

// system-generated JWT secret
const JWT_SECRET = crypto.randomBytes(64).toString('hex')
const JWT_EXPIRES = '1d'

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

/* ===============================
   SEND OTP
================================ */
exports.sendOtp = async (req, res) => {
  try {
    const { email, password = null } = req.body

    if (!email)
      return res.status(400).json({ message: 'Email is required' })

    const otp = generateOTP()
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000)

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        email,
        password,
        otp,
        otpExpire,
        isVerify: false
      })
    } else {
      user.otp = otp
      user.otpExpire = otpExpire
      await user.save()
    }

    await transporter.sendMail({
      from: `"OTP System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `
    })

    return res.json({
      success: true,
      message: 'OTP sent successfully'
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}


/* ===============================
   VERIFY OTP
================================ */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' })

    const user = await User.findOne({ email })

    if (!user)
      return res.status(404).json({ message: 'User not found' })

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' })

    if (user.otpExpire < Date.now())
      return res.status(400).json({ message: 'OTP expired' })

    user.isVerify = true
    user.otp = null
    user.otpExpire = null
    await user.save()

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    return res.json({
      success: true,
      message: 'OTP verified successfully',
      token
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
