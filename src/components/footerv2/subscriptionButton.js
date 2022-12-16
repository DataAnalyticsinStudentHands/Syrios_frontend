import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { emailRegExp } from 'src/utils/RegExpRules';
function SubscriptionButton(){
    const [show, setShow] = useState(false)
	const {register, handleSubmit, formState: { errors }} = useForm({defaultValues:{email:""}})
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
                    {...register("email",{
                        pattern: {value: emailRegExp, message:"* Must be a valid email address"}
                    })}/>
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
