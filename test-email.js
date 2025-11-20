const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  line = line.trim();
  // Skip comments and empty lines
  if (!line || line.startsWith('#')) return;
  
  const equalsIndex = line.indexOf('=');
  if (equalsIndex === -1) return;
  
  const key = line.substring(0, equalsIndex).trim();
  let value = line.substring(equalsIndex + 1).trim();
  
  // Remove surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  
  envVars[key] = value;
});

console.log('\n📄 Loaded environment variables:');
console.log('EMAIL_USER:', envVars.EMAIL_USER);
console.log('EMAIL_SERVICE:', envVars.EMAIL_SERVICE);
console.log('EMAIL_PASSWORD:', envVars.EMAIL_PASSWORD ? '✓ Set (hidden)' : 'Not set');

const transporter = nodemailer.createTransport({
  service: envVars.EMAIL_SERVICE || 'gmail',
  auth: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASSWORD,
  },
});

async function testEmail() {
  try {
    console.log('\n🧪 Testing email configuration...');
    console.log('📧 Email User:', envVars.EMAIL_USER);
    console.log('🔧 Email Service:', envVars.EMAIL_SERVICE);

    // Verify connection
    const verified = await transporter.verify();
    if (verified) {
      console.log('\n✅ Email service connected successfully!');
    }

    // Send test email
    const testMail = {
      from: envVars.EMAIL_USER,
      to: envVars.EMAIL_USER,
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

    console.log('\n📨 Sending test email...');
    const result = await transporter.sendMail(testMail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    console.log('\n🎉 Email service is working properly!\n');

  } catch (error) {
    console.error('\n❌ Email service test failed:');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Check if EMAIL_USER is correct:', envVars.EMAIL_USER);
    console.error('2. Check if EMAIL_PASSWORD (app-specific password) is correct');
    console.error('3. Make sure Gmail account has "Less secure app access" enabled or use App Password');
    console.error('4. Verify .env file has correct EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASSWORD');
    process.exit(1);
  }
}

testEmail();
