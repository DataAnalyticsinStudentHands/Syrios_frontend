import React from "react";

const FeedBackicon = (props) =>{

    let url = 'https://universityofhouston.iad1.qualtrics.com/jfe/form/SV_e8xJud3C0FsmNz8'
    if (props.formfor === 'timeline'){
        url = 'https://universityofhouston.iad1.qualtrics.com/jfe/form/SV_cH1hVPx2L60opzo'
    }
    if (props.formfor === 'coinpile'){
        url = 'https://universityofhouston.iad1.qualtrics.com/jfe/form/SV_42h2oKFIZHcBeaq'
    }
    return(
        <div className='feedbackicon'>
        <a href={url}
        target="_blank" rel="noopener noreferrer">
        <svg width="100%" viewBox="0 0 286 427" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_0_1)">
          <circle cx="213.5" cy="189.5" r="209.5" fill={props.color??'#987818'}/>
          </g>
          <text x="103.5" y="169.5" fill="white" className='feedbacktext'>   
            Give us
          </text>
          <text x="93.5" y="229.5" fill="white" className='feedbacktext'>   
            Usability
          </text>
          <text x="83.5" y="289.5" fill="white" className='feedbacktext'>   
            Feedback!
          </text>        
          <defs>
            <filter id="filter0_d_0_1" x="0" y="0" width="427" height="427" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
            </filter>
          </defs>
        </svg>
        </a>
      </div>
    )
}
export default FeedBackicon