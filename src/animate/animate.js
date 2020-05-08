import React, { Component } from 'react';
import './animate.css'
import Coins from '../data/images.json'


class Animate extends Component {

    //TODO- We can use componentDidMount while fetching images from APIs
    componentDidMount() {
        // fetch('../data/images.json')
        // .then((res) => res.json())
        // .then(data => console.log(data)); 
        // .then((json) => {
        //     console.log(json);
        //     this.setState({
        //         images: json
        //     })
        // })
        // { images.map(({id, src, title, description}) => <img key={id} src={src} title={title} alt={description} />)
    }

    render() {
        // const images = this.state;
        return(
            <div className='animate'>
                <div className='coin-bg'>
                    {Coins.coins.map((image) => 
                        <img src={require('../images' + image.src)} key={image.id} className={image.className} alt={image.alt}/>
                    )}
                </div>
            </div>
    );}
}


export default Animate;