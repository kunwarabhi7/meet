export const createEventTemplate = ({
  name,
  date,
  time,
  location,
  description,
  maxAttendees,
  category,
  subCategory,
  eventId,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Created</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(90deg, #4b6cb7, #182848); padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Let's Meet🧑‍🤝‍🧑</h1>
                  <p style="color: #d1d5db; margin: 5px 0 0; font-size: 14px;">Your event is ready to shine!</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px;">🎉 Event Created: ${name}</h2>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 15px;">
                    Congratulations! Your event has been successfully created. Here are the details:
                  </p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Date:</strong> ${date}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Time:</strong> ${time}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Location:</strong> ${location}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Category:</strong> ${category}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Sub-Category:</strong> ${subCategory}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Description:</strong> ${
                          description || "No description provided"
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #4b5563; font-size: 16px;">
                        <strong>Max Attendees:</strong> ${
                          maxAttendees || "Unlimited"
                        }
                      </td>
                    </tr>
                  </table>
                  <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                    <strong>Note:</strong> Please ensure this event name is unique to avoid confusion with other events.
                  </p>
                  <!-- Call-to-Action -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #4b6cb7; border-radius: 4px;">
                        <a href="http://your-app.com/events/${eventId}" style="display: inline-block; padding: 12px 24px; color: #ffffff; font-size: 16px; text-decoration: none; font-weight: bold;">
                          View Your Event
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f3f4f6; padding: 20px; text-align: center;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    © 2025 Let's Meet🧑‍🤝‍🧑. All rights reserved.
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                    Need help? <a href="mailto:support@eventscheduler.com" style="color: #4b6cb7; text-decoration: none;">Contact Us</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getVerificationEmail = ({ name, verificationLink }) => {
  // Keep existing verification email template unchanged
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(90deg, #4b6cb7, #182848); padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Let's Meet🧑‍🤝‍🧑</h1>
                  <p style="color: #d1d5db; margin: 5px 0 0; font-size: 14px;">Welcome to our community!</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px;">👋 Welcome, ${name}!</h2>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin: 0 0 15px;">
                    Thank you for joining Let's Meet🧑‍🤝‍🧑! To get started, please verify your email address by clicking the button below:
                  </p>
                  <!-- Call-to-Action -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #4b6cb7; border-radius: 4px;">
                        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; color: #ffffff; font-size: 16px; text-decoration: none; font-weight: bold;">
                          Verify Your Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 20px 0;">
                    This link will expire in 1 hour. If you didn’t create an account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f3f4f6; padding: 20px; text-align: center;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    © 2025 Let's Meet🧑‍🤝‍🧑. All rights reserved.
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                    Need help? <a href="mailto:support@eventscheduler.com" style="color: #4b6cb7; text-decoration: none;">Contact Us</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
