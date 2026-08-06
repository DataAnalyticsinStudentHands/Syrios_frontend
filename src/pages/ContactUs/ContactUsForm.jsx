/**
 * ContactUsForm.jsx — Vite Migration Refactor (2026)
 *
 * Changes:
 * - `.js` → `.jsx`
 * - `process.env.REACT_APP_strapiURL` → `import.meta.env.VITE_STRAPI_URL`
 * - fixed `.then(setShow(true))` → `.then(() => setShow(true))`
 *
 * Everything else is intentionally preserved.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import submissionRequest from 'src/api/submissions';
import { phoneRegExp, emailRegExp, nameRegExp } from 'src/utils/RegExpRules';

function ContactUsForm() {
    const [show, setShow] = useState(false);
    const { register, handleSubmit,
        formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            await submissionRequest.contact(data);
            setShow(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div id='ContactUsForm'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='formItem'>
                    <label>Full Name</label>
                    {show
                        ? <input type="text" {...register('name')} disabled />
                        : <input type="text" {...register('name', {
                            required: "* Name is required",
                            minLength: { value: 3, message: "* Names must have at least 3 characters" },
                            maxLength: { value: 30, message: "* Names can't be longer than 30 characters" },
                            pattern: { value: nameRegExp, message: "* Names can only be letters" }
                        })} />
                    }
                    {errors.name && <p className='error-message'>{errors.name.message}</p>}
                </div>

                <div className='formItem'>
                    <label>Email Address</label>
                    {show
                        ? <input type="email" {...register('email')} disabled />
                        : <input type="email" {...register('email', {
                            required: "* Email is required",
                            pattern: { value: emailRegExp, message: "* Must be a valid email address" }
                        })} />
                    }
                    {errors.email && <p className='error-message'>{errors.email.message}</p>}
                </div>

                <div className='formItem'>
                    <label>Phone</label>
                    {show
                        ? <input type="text" {...register('phone')} disabled />
                        : <input type="text" {...register('phone', {
                            required: '* Phone number required',
                            pattern: { value: phoneRegExp, message: "* Phone number is not valid" }
                        })} />
                    }
                    {errors.phone && <p className='error-message'>{errors.phone.message}</p>}
                </div>

                <div className='formItem'>
                    <label>Message</label>
                    {show
                        ? <textarea rows="8" {...register("message")} disabled />
                        : <textarea rows="8" {...register("message", {
                            required: "* Message is required"
                        })} />
                    }
                    {errors.message && <p className='error-message'>{errors.message.message}</p>}
                </div>

                <div className='formItem'>
                    {show
                        ? <input type="checkbox" placeholder="Subscription us?" {...register("isSubscription?", { value: true })} disabled />
                        : <input type="checkbox" placeholder="Subscription us?" {...register("isSubscription?", { value: true })} />
                    }
                    <span> Subscribe to get the latest update!</span>
                </div>

                <div className='formItem'>
                    {show
                        ? <p className='contacting'>Thanks for contacting us!</p>
                        : <input type="submit" />
                    }
                </div>
            </form>
        </div>
    );
}

export default ContactUsForm;