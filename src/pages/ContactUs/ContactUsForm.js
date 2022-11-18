import React, {useState} from 'react';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios';

const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
const nameRegExp = /[A-Za-z ]/i;
const ContactUsSchema = yup.object({
    name: yup.string()
        .required('* Full name is required')
        .min(3, '* Names must have at least 3 characters')
        .max(15, "* Names can't be longer than 15 characters")
        .matches(nameRegExp, "* Names can only be letters"),
	email: yup.string()
        .required('* Email is required')
        .email('*Must be a valid email address')
        .max(100, '*Email must be less than 100 characters'),
    phone: yup.string()
        .required('* Phone number required')
        .matches(phoneRegExp, '*Phone number is not valid'),
    message: yup.string()
        .required('*Message required')
        .max(255, '*Email must be less than 255 characters'),
})
function ContactUsForm (){
    const [show, setShow] = useState(false)
    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(ContactUsSchema)})
    const onSubmit = (data) => {
        axios.post(`${process.env.REACT_APP_strapiURL}/api/user-contact-us`, {data:data})
            .then(setShow(true))
            .catch(err =>{console.error(err)})
    }
    return(
        <div id='ContactUsForm'>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className='formItem'>
                    <label>Full Name</label>
                    {show?  <input type="text" {...register('name')} disabled/>: <input type="text" {...register('name')}/>}
                    { errors.name && <p className='error-message'>{errors.name.message}</p>}
                </div>
                <div className='formItem'>
                    <label>Email Address</label>
                    {show?  <input type="email" {...register('email')} disabled/>: <input type="email" {...register('email')} />}
                    {errors.email && <p className='error-message'>{errors.email.message}</p>}
                </div>
                <div className='formItem'>
                    <label>Phone</label>
                    {show?  <input type="text" {...register('phone')} disabled/>: <input type="text" {...register('phone')} />}
                    {errors.phone && <p className='error-message'>{errors.phone.message}</p>}
                </div>
                <div className='formItem'>
                    <label>Message</label>
                    {show?  <textarea rows="8" {...register("message")} disabled/>: <textarea rows="8" {...register("message")} />}
                    {errors.message && <p className='error-message'>{errors.message.message}</p>}
                </div>
                <div className='formItem'>
                    {show?  
                        <input type="checkbox" placeholder="Subscription us?" {...register("isSubscription?", {value: true })} disabled/>: 
                        <input type="checkbox" placeholder="Subscription us?" {...register("isSubscription?", {value: true })} />}
                    <span> Subscrip us to get the latest update!</span>
                </div>
                {show
                    ? <p className='contacting'>Thanks for contacting us!</p>
                    :<input type="submit" />
                }
            </form>
        </div>
    )
}
export default ContactUsForm