class ImageRegion extends React.Component {
    render () {
        return (
               <div className="row">
                    <div className="large-8 columns">
                        <div className="block" style={{position: "relative"}}>
                            <img src="http://www.propcom.co.uk/assets/img/what-we-do/ecommerce/magento.jpg" style={{width: "100%", height: "300px"}} />
                            <div className="overlay__settings" style={{position: "absolute", top: "25px", right: "25px"}}>
                                <button>X</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
};

export default ImageRegion;