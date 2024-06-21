import React, { useState } from 'react';

const IntakeForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 p-6 my-8">
      <h3 className="text-2xl font-bold">Stay Updated!</h3>
      <p className="mt-2">Subscribe to our newsletter to get the latest updates directly in your inbox.</p>
      {formSubmitted ? (
        <p className="mt-4 text-green-500">Thank you for signing up to keep in touch with our newsletter!</p>
      ) : (
        <form name="newsletter" method="POST" data-netlify="true" onSubmit={handleSubmit} className="mt-4">
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="hidden">
            <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
          </p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};

export default IntakeForm;
