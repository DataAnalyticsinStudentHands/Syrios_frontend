/**
 * SubscriptionButton.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles user email subscription submission to Strapi backend.
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this component returns JSX
 *
 * 2. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 3. Fixed async handler bug
 *    - `.then(setShow(true))` → `.then(() => setShow(true))`
 *
 * 4. Preserved behavior
 *    - Form validation, submission, and success state remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Notes:
 * - Uses react-hook-form
 * - Uses shared email regex from utils
 *
 * Future Improvements:
 * - Add loading state
 * - Add success/error UI feedback
 * - Move API call to shared request layer
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { emailRegExp } from "src/utils/RegExpRules";

const baseURL = import.meta.env.VITE_STRAPI_URL;

function SubscriptionButton() {
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = (data) => {
    axios
      .post(`${baseURL}/api/user-subscription`, { data })
      .then(() => setShow(true))
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {show ? (
        <div id="footer2-syrios">Thanks for follow us!</div>
      ) : (
        <form className="input-addon" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            id="footer2-email"
            placeholder="Enter your email"
            className="input-addon__input"
            {...register("email", {
              pattern: {
                value: emailRegExp,
                message: "* Must be a valid email address",
              },
            })}
          />

          <div className="input-addon__addon input-addon__addon--appended">
            <button type="submit" id="footer_submit" className="px-3">
              Submit
            </button>
          </div>
        </form>
      )}

      {errors.email && (
        <div className="error-message">{errors.email.message}</div>
      )}
    </>
  );
}

export default SubscriptionButton;