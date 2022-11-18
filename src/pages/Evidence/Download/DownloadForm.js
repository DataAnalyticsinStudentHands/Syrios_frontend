import React, {useState} from 'react';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios';
import { saveAs } from 'file-saver';

const DowunloadSchema = yup.object({
    name: yup.string()
        .required('* Full name is required')
        .min(3, '* Names must have at least 3 characters')
        .max(15, "* Names can't be longer than 15 characters")
        .matches(/[A-Za-z ]/i, "* Names can only be letters"),
	email: yup.string()
        .required('* Email is required')
        .email('*Must be a valid email address')
        .max(100, '*Email must be less than 100 characters'),
})

function DownloadForm (props){
    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(DowunloadSchema)})
    const [show, setShow] = useState(false)

    const onSubmit = (data) => {
        axios.post(`${process.env.REACT_APP_strapiURL}/api/user-download`, {data:data})
            .then(saveAs(`${process.env.REACT_APP_strapiURL}${props.url}`,'AntiochCoins.zip'))
            .then(setShow(true))
            .catch(err =>{console.error(err)})
    }

    return(
        <>
        <div id='downloadNotes'>Please provide your your name and email address in the form below to start the download.</div>
        <div id='downloadForm'>

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
                    {show?  
                        <input type="checkbox" placeholder="Subscription us?" {...register("isSubscription?", {value: true })} disabled/>: 
                        <input type="checkbox" placeholder="Subscription us?" {...register("isSubscription?", {value: true })} />}
                    <span> Subscrip us to get the latest update!</span>

                </div>
                {show
                    ? <p className='downloading'>Data is downloading!</p>
                    :<input type="submit" />
                }
            </form>
            

        </div>
        </>
    )
}
export default DownloadForm