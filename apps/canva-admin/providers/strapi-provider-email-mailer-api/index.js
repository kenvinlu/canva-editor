const axios = require('axios');

module.exports = {
  init(providerOptions = {}, settings = {}) {
    const { apiUrl, apiKey } = providerOptions;

    if (!apiUrl) {
      throw new Error('Mailer API URL is required in providerOptions.apiUrl');
    }

    if (!apiKey) {
      throw new Error('API key is required in providerOptions.apiKey');
    }

    return {
      send(options) {
        // Prepare email payload
        const emailPayload = {
          to: options.to,
          subject: options.subject,
          from: settings.defaultFrom || options.from,
          replyTo: settings.defaultReplyTo || options.replyTo,
          text: options.text || options.html,
          html: options.html || options.text,
        };

        // Add optional fields
        if (options.cc) emailPayload.cc = options.cc;
        if (options.bcc) emailPayload.bcc = options.bcc;
        if (options.attachments) emailPayload.attachments = options.attachments;

        // Make HTTP request to Next.js API
        return axios
          .post(`${apiUrl}/send-email`, emailPayload, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
            timeout: 30000, // 30 seconds timeout
          })
          .then((response) => {
            // Return response in a format similar to nodemailer
            return {
              messageId: response.data.messageId || `mailer-api-${Date.now()}`,
              response: response.data.message || 'Email sent successfully',
            };
          })
          .catch((error) => {
            // Handle errors
            if (error.response) {
              // Server responded with error status
              throw new Error(
                `Email sending failed: ${error.response.data?.error || error.response.statusText}`
              );
            } else if (error.request) {
              // Request was made but no response received
              throw new Error('Email sending failed: No response from Next.js API');
            } else {
              // Error setting up the request
              throw new Error(`Email sending failed: ${error.message}`);
            }
          });
      },
    };
  },
};

