import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Service:', process.env.EMAIL_SERVICE);

    // Verify connection
    const verified = await transporter.verify();
    if (verified) {
      console.log('✅ Email service connected successfully!');
    }

    // Send test email
    const testMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🧪 FreshGuard Email Test - Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">FreshGuard</h1>
            <p style="margin: 5px 0 0 0;">Email Service Test</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Hi there!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #27ae60; font-weight: bold; font-size: 18px;">✅ Email Service is Working!</p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This is a test email to verify that the FreshGuard email notification system is working properly.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2025 FreshGuard. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(testMail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);

  } catch (error) {
    console.error('❌ Email service test failed:');
    console.error('Error:', error);
    process.exit(1);
  }
}

testEmail();
