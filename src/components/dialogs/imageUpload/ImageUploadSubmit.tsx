import React from 'react';

function ImageUploadSubmit() {
    return (
            <form method='post'
                  action="https://api.fantompixels.com/test-img/generate-chain-image"
                  encType="multipart/form-data">
                <input type='file' name='generate_chain_image'/>
                <input type='submit' value='Upload'/>
            </form>
    );
}

export default ImageUploadSubmit;