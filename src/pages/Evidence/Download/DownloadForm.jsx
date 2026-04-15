/**
 * DownloadForm.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Collects user info before triggering the dataset download.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Form fields, validation rules, and download flow remain unchanged
 *
 * 2. Fixed Submission Logic
 *    - Prevents `saveAs()` and `setShow(true)` from executing immediately
 *    - Ensures the POST request completes before the download starts
 *
 * 3. Improved Safety
 *    - Guards against missing download URL
 *    - Uses async/await for clearer control flow
 *
 * Notes:
 * - This component does not depend on Strapi response normalization directly
 * - `props.url` is expected to be a relative upload path from Strapi media
 *
 * Future Improvements:
 * - Add visible submission/loading state while POST request is in progress
 * - Rename `isSubscription?` field to a cleaner backend-safe name
 * - Add success/error messaging for failed submission attempts
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { emailRegExp, nameRegExp } from 'src/utils/RegExpRules';

const baseURL = import.meta.env.VITE_STRAPI_URL;

function DownloadForm(props) {
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${baseURL}/api/user-download`, { data });

      if (props.url) {
        saveAs(`${baseURL}${props.url}`, 'AntiochCoins.zip');
      }

      setShow(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div id='downloadNotes'>
        Please provide your your name and email address in the form below to start the download.
      </div>

      <div id='downloadForm'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='formItem'>
            <label>Full Name</label>
            {show ? (
              <input type="text" {...register('name')} disabled />
            ) : (
              <input
                type="text"
                {...register('name', {
                  required: "* Name is required",
                  minLength: { value: 3, message: "* Names must have at least 3 characters" },
                  maxLength: { value: 30, message: "* Names can't be longer than 30 characters" },
                  pattern: { value: nameRegExp, message: "* Names can only be letters" }
                })}
              />
            )}
            {errors.name && <p className='error-message'>{errors.name.message}</p>}
          </div>

          <div className='formItem'>
            <label>Email Address</label>
            {show ? (
              <input type="email" {...register('email')} disabled />
            ) : (
              <input
                type="email"
                {...register('email', {
                  required: "* Email is required",
                  pattern: { value: emailRegExp, message: "* Must be a valid email address" }
                })}
              />
            )}
            {errors.email && <p className='error-message'>{errors.email.message}</p>}
          </div>

          <div className='formItem'>
            {show ? (
              <input
                type="checkbox"
                placeholder="Subscription us?"
                {...register("isSubscription?", { value: true })}
                disabled
              />
            ) : (
              <input
                type="checkbox"
                placeholder="Subscription us?"
                {...register("isSubscription?", { value: true })}
              />
            )}
            <span> Subscrip us to get the latest update!</span>
          </div>

          {show ? (
            <p className='downloading'>Data is downloading!</p>
          ) : (
            <input type="submit" />
          )}
        </form>
      </div>
    </>
  );
}

export default DownloadForm;