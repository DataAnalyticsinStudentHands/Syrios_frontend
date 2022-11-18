import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios';

const SubscriptionSchema = yup.object().shape({
	email: yup.string().email('*Must be a valid email address').max(100, '*Email must be less than 100 characters')
})
function SubscriptionButton(){
    const [show, setShow] = useState(false)
	const {register, handleSubmit, formState: { errors }} = useForm({
		resolver: yupResolver(SubscriptionSchema)
	})
	const onSubmit = (data) => {
        axios.post(`${process.env.REACT_APP_strapiURL}/api/user-subscription`, {data:data})
        .then(setShow(true))
        .catch(err =>{console.error(err)})
    }
    return(
        <>
            {show 
            ? <div id="footer2-syrios"> Thanks for follow us!</div>
            :<form className="input-addon" onSubmit={handleSubmit(onSubmit)}>
                <input type="text" name="email" id="footer2-email" placeholder="Enter your email" className="input-addon__input"
                    {...register("email")}/>
                <div className="input-addon__addon input-addon__addon--appended">
                    <button  type="submit" id="footer_submit" className="px-3">Submit</button>
                </div>
            </form>
            }
            {errors.email && <div className="error-message">{errors.email.message}</div>}
        </>
    )
}
export default SubscriptionButton
