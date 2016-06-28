class ImageRegion extends React.Component {
    constructor() {
        super();
        this.state = {
            url: "http://www.propcom.co.uk/assets/img/what-we-do/ecommerce/magento.jpg",
            modal: 'none'
        }
    };

    handleClick(id) {
        this.props.remove(id);
    };

    handleChange(e) {
        this.setState({
            url: e.target.value
        });
    };

    openModal() {
        this.setState({
            modal: 'block'
        })
    }

    render() {

        return (
            <div className="row">
                <div className="large-8 columns">
                    <div className="block" style={{position: "relative"}}>
                        <img src={this.state.url}
                             style={{width: "100%", height: "300px"}}/>
                        <div className="overlay__settings" style={{position: "absolute", top: "25px", right: "25px"}}>
                            <button onClick={this.handleClick.bind(this, this.props.id)}>X</button>
                            <button onClick={this.openModal.bind(this)}>U</button>
                            <div style={{left: 0, right: 0, display: this.state.modal }}>
                                <input type="text" onChange={this.handleChange.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
;

export default ImageRegion;