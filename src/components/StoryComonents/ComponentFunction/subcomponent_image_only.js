const subcomponent_image_only = (image) => {
    let imageSizes = {
      "XXS": "50px",
      "XS": "150px",
      "S": "250px",
      "M": "350px",
      "L": "450px",
      "XL": "550px",
      "XXL": "650px"
    };
    return (
        <img
          src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}            
          alt={image.image.alternativeText === undefined ? 'img' : image.image.alternativeText}
          width={imageSizes[image.size]} 
        />
    );
  }
export default subcomponent_image_only;