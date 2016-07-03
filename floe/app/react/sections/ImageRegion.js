import Options from '../ui/Options';

class ImageRegion extends React.Component {

    constructor() {
        super();
        this.state = {
            defaults: {
                url: 'http://www.propcom.co.uk/assets/img/what-we-do/ecommerce/magento.jpg',
                width: '100%',
                height: '200'
            }
        }
    };

    removeElement(id) {
        this.props.remove(id);
    };

    updateState(e) {
        this.setState({
            defaults: {
                url: e.url,
                width: e.width,
                height: e.height
            }
        })
    };

    render() {
        return (
            <div className="row">
                <div className="large-12 columns">
                    <div className="block" style={{position: "relative"}}>
                        <img src={this.state.defaults.url}
                             style={{width: this.state.defaults.width, height: this.state.defaults.height}}/>

                        <Options remove={this.removeElement.bind(this)}
                                 id={this.props.id}
                                 defaults={this.state.defaults}
                                 update={this.updateState.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ImageRegion;