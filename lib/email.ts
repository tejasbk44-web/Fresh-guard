import nodemailer from 'nodemailer';

// Configure your email service here
// Using environment variables for email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailNotification {
  to: string;
  subject: string;
  itemName: string;
  expiryDate: string;
  daysRemaining: number;
}

export async function sendExpiryReminder(notification: EmailNotification) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">FreshGuard</h1>
          <p style="margin: 5px 0 0 0;">Food Expiry Reminder</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px;">Hi there!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0 0 10px 0; color: #666;">Your item is expiring soon:</p>
            <h2 style="margin: 10px 0; color: #333;">${notification.itemName}</h2>
            <p style="margin: 10px 0; font-size: 14px; color: #666;">
              <strong>Expiry Date:</strong> ${new Date(notification.expiryDate).toLocaleDateString()}
            </p>
            <p style="margin: 10px 0; font-size: 14px; color: #666;">
              <strong>Days Remaining:</strong> 
              <span style="color: ${notification.daysRemaining <= 0 ? '#e74c3c' : notification.daysRemaining <= 3 ? '#f39c12' : '#27ae60'}; font-weight: bold;">
                ${notification.daysRemaining} days
              </span>
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Please use or dispose of this item accordingly to reduce food waste.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Your Inventory
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            © 2025 FreshGuard. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notification.to,
      subject: notification.subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendExpiredReminder(notification: EmailNotification) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">FreshGuard</h1>
          <p style="margin: 5px 0 0 0;">⚠️ Item Has Expired</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px;">Hi there!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
            <p style="margin: 0 0 10px 0; color: #e74c3c; font-weight: bold;">⚠️ This item has expired</p>
            <h2 style="margin: 10px 0; color: #333;">${notification.itemName}</h2>
            <p style="margin: 10px 0; font-size: 14px; color: #666;">
              <strong>Expiry Date:</strong> ${new Date(notification.expiryDate).toLocaleDateString()}
            </p>
            <p style="margin: 10px 0; font-size: 14px; color: #e74c3c; font-weight: bold;">
              Expired ${Math.abs(notification.daysRemaining)} days ago
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Please discard this item to keep your inventory fresh and safe.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Update Your Inventory
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            © 2025 FreshGuard. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notification.to,
      subject: notification.subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export interface ItemCreatedEmailData {
  to: string;
  userName: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  purchaseDate: string;
  expiryDate: string;
}

export async function sendItemCreatedEmail(data: ItemCreatedEmailData) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">FreshGuard</h1>
          <p style="margin: 5px 0 0 0;">✓ Product Added Successfully</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px;">Hi ${data.userName},</p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Your new product has been successfully added to your inventory.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h2 style="margin: 10px 0 15px 0; color: #27ae60;">${data.itemName}</h2>
            
            <table style="width: 100%; font-size: 14px; color: #666;">
              <tr>
                <td style="padding: 8px 0;"><strong>Category:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${data.category}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Quantity:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${data.quantity} ${data.unit}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Location:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${data.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Purchase Date:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${new Date(data.purchaseDate).toLocaleDateString()}</td>
              </tr>
              <tr style="border-top: 1px solid #e0e0e0;">
                <td style="padding: 8px 0; padding-top: 12px;"><strong>Expiry Date:</strong></td>
                <td style="padding: 8px 0; padding-top: 12px; text-align: right; color: #e74c3c; font-weight: bold;">
                  ${new Date(data.expiryDate).toLocaleDateString()}
                </td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Keep track of your items and receive reminders as they approach their expiry dates.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Your Inventory
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            © 2025 FreshGuard. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.to,
      subject: `Confirmation: ${data.itemName} Added to Your Inventory`,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Item creation email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send item creation email:', error);
    throw error;
  }
}
