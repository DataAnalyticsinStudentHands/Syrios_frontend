import React, {useState} from "react";
import { useFormik} from 'formik';
import * as Yup from "yup"
import axios from 'axios';

function SubscriptionButton(){

    const [show, setShow] = useState(false)

    const formik = useFormik({
        initialValues:{
          email:""
        },
        validationSchema:Yup.object().shape({
            email: Yup.string()
              .email('*Must be a valid email address')
              .max(100, '*Email must be less than 100 characters')
              .required('* Email is required')
          }),
        onSubmit: (values,{resetForm})=>{
            axios.post(`${process.env.REACT_APP_strapiURL}/api/user-subscription`, {data:values})
            .then(resetForm())
            .then(setShow(true))
            .catch(err =>{console.error(err)})
        }
      })

    return(
        <div>
            {show
                ? <div id="footer2-syrios"> Thanks for follow us!</div>
                :<form className="input-addon" onSubmit={formik.handleSubmit}>
                    <input type="text" name="email" id="footer2-email" placeholder="Enter your email" className="input-addon__input" 
                        onChange={formik.handleChange}
                        onBlur = {formik.handleBlur}
                        value = {formik.values.email}
                    />
                    <div className="input-addon__addon input-addon__addon--appended">
                        <button  type="submit" id="footer_submit" className="px-3">Submit</button>
                    </div>
                </form>
            }
            {formik.touched.email && formik.errors.email ? <div className="error-message">{formik.errors.email}</div>: null}

        </div>

    )

}
export default SubscriptionButton
